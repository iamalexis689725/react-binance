import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Menu from "../../../components/Menu";
import LabelBS from "../../../components/LabelBS";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormSelect,
  Row,
} from "react-bootstrap";
import { getTarjetasMine } from "../../../services/TarjetasService";
import { getBilleterasById, updateBilleteraPatch } from "../../../services/BilleteraService";
import { createMovimiento } from "../../../services/Movimiento";

const TarjetasForm = () => {
  const { id } = useParams();
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState('');
  const [saldo, setSaldo] = useState(0);
  const [conversion, setConversion] = useState(0);
  const [valorAnt, setValorAnt] = useState(0);
  const [tasaConversion, setTasaConversion] = useState(0);
  const [tarjetas, setTarjetas] = useState([]);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const tarjetasData = await getTarjetasMine();
        setTarjetas(tarjetasData);
      } catch (error) {
        console.log("There was an error fetching the tarjetas!", error);
      }
    };
    fetchTarjetas();
  }, []);

  useEffect(() => {
    if (id) {
      fetchBilletera();
    }
  }, [id]);

  const fetchBilletera = () => {
    getBilleterasById(id)
      .then((res) => {
        const billetera = res;
        setValorAnt(billetera.saldo);
        setTasaConversion(billetera.moneda.valorMoneda);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const guardarMovimiento = async (monto, billeteraId) => {
    const movimiento = {
      monto: monto,
      tipo: "ingreso",
      fecha: new Date().toISOString(),
      billetera_id: Number(billeteraId),
      movReferencia_id: null,
    };

    try {
      await createMovimiento(movimiento);
    } catch (error) {
      console.log("Error al guardar el movimiento:", movimiento);
    }
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const nuevoSaldo = Number(valorAnt) + (Number(saldo) * Number(tasaConversion));
    const billetera = {
      saldo: nuevoSaldo,
    };

    if (id) {
      try {
        await updateBilleteraPatch(id, billetera);
        await guardarMovimiento(Number(saldo) * Number(tasaConversion), id);
        navigate("/billeteras");
      } catch (err) {
        console.log(err);
        setErrors({
          ...errors,
          formError: "Error al actualizar el saldo de la billetera, intente nuevamente",
        });
      }
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h1>Hacer deposito</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}

                  <FormGroup className="mt-2">
                    <LabelBS text="Tarjetas" />
                    <FormSelect
                      required
                      value={tarjetaSeleccionada}
                      onChange={(e) => {
                        setTarjetaSeleccionada(e.target.value);
                      }}
                    >
                      <option value="">Seleccione una tarjeta</option>
                      {tarjetas.map((tarjeta) => (
                        <option
                          key={"tarjeta-" + tarjeta.id}
                          value={tarjeta.id}
                        >
                          {tarjeta.nombre} {tarjeta.numero}
                        </option>
                      ))}
                    </FormSelect>
                    <Form.Control.Feedback type="invalid">
                      La tarjeta es requerida
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Monto en USD" />
                    <FormControl
                      required
                      type="number"
                      value={saldo}
                      onChange={(e) => setSaldo(Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">
                      El monto en USD es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Conversion:" />
                    <FormControl
                      type="number"
                      value={saldo * tasaConversion}
                      readOnly
                    />
                  </FormGroup>

                  <div className="mt-2">
                    <Button type="submit">Guardar</Button>
                    <Link to="/tarjetas/create" className="btn btn-secondary ml-2">
                      Crear Tarjeta
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TarjetasForm;