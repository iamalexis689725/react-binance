import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCuentasMine } from "../../../services/CuentasService";
import { getBilleterasById, updateBilleteraPatch } from "../../../services/BilleteraService";
import { createMovimiento } from "../../../services/Movimiento";
import Menu from "../../../components/Menu";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormSelect, Row } from "react-bootstrap";
import LabelBS from "../../../components/LabelBS";

const CuentasForm = () => {
  const { id } = useParams();
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState('');
  const [saldo, setSaldo] = useState(0);
  const [valorAnt, setValorAnt] = useState(0);
  const [tasaConversion, setTasaConversion] = useState(0);
  const [cuentas, setCuentas] = useState([]);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const cuentasData = await getCuentasMine();
        setCuentas(cuentasData);
      } catch (error) {
        console.log("There was an error fetching the cuentas!", error);
      }
    };
    fetchCuentas();
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
        setTasaConversion(billetera.moneda.valorUSD);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const guardarMovimiento = async (monto, billeteraId) => {
    const movimiento = {
      monto: monto,
      tipo: "egreso",
      fecha: new Date().toISOString(),
      billetera_id: Number(billeteraId),
      movReferencia_id: null,
    };

    console.log(movimiento);

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

    const nuevoSaldo = Number(valorAnt) - Number(saldo);
    const billetera = {
      saldo: nuevoSaldo,
    };

    if (id) {
      try {
        await updateBilleteraPatch(id, billetera);
        await guardarMovimiento(Number(saldo), id);
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
                  <h1>Hacer Retiro</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}

                  <FormGroup className="mt-2">
                    <LabelBS text="Cuentas" />
                    <FormSelect
                      required
                      value={cuentaSeleccionada}
                      onChange={(e) => {
                        setCuentaSeleccionada(e.target.value);
                      }}
                    >
                      <option value="">Seleccione una cuenta</option>
                      {cuentas.map((cuenta) => (
                        <option
                          key={"cuenta-" + cuenta.id}
                          value={cuenta.id}
                        >
                          {cuenta.numeroCuenta} {cuenta.banco}
                        </option>
                      ))}
                    </FormSelect>
                    <Form.Control.Feedback type="invalid">
                      La cuenta es requerida
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Monto" />
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
                    <LabelBS text="Conversion a USD:" />
                    <FormControl
                      type="number"
                      value={saldo * tasaConversion}
                      readOnly
                    />
                  </FormGroup>

                  <div className="mt-2">
                    <Button type="submit">Guardar</Button>
                    <Link to="/cuenta/create" className="btn btn-secondary ml-2">
                      Crear Cuenta
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

export default CuentasForm;
