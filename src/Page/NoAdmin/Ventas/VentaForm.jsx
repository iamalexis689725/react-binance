import { useEffect, useState } from "react";
import Menu from "../../../components/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { getBilleterasById } from "../../../services/BilleteraService";
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Row,
} from "react-bootstrap";
import LabelBS from "../../../components/LabelBS";
import { createVenta } from "../../../services/VentasService";

const VentaForm = () => {
  const { id } = useParams();

  const [monedaId, setMonedaId] = useState("");
  const [monedaNombre, setMonedaNombre] = useState("");
  const [valor, setValor] = useState("");
  const [monto, setMonto] = useState("");
  const [billeteraOrigenId, setBilleteraOrigenId] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarioLogueado();
    if (id) {
      fetchBilletera();
    }
  }, [id]);

  const fetchBilletera = () => {
    getBilleterasById(id)
      .then((res) => {
        const billetera = res;
        setBilleteraOrigenId(billetera.id);
        setMonedaId(billetera.moneda.id);
        setMonedaNombre(billetera.moneda.nombre);
        setSaldo(billetera.saldo);  // Asumiendo que el saldo se encuentra en billetera.saldo
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUsuarioLogueado = () => {
    axios
      .get("http://localhost:3000/auth/me", getCommonHeaders())
      .then((response) => {
        setUsuarioId(response.data.sub);
      })
      .catch((error) => {
        console.error("Error fetching logged in user", error);
      });
  };

  const enviarDatos = (e) => {
    const form = e.currentTarget;
    let isValid = form.checkValidity();
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (!isValid) {
      return;
    }

    if (monto > saldo) {
      setErrors({
        ...errors,
        formError: "Saldo insuficiente en la billetera",
      });
      return;
    }

    try {
      const guardarMiVenta = {
        moneda_id: Number(monedaId),
        valor: valor,
        monto: monto,
        billeteraOrigen_id: Number(billeteraOrigenId),
        metodoDePago: metodoPago,
        estado: 1,
        usuario_id: usuarioId,
      };

      createVenta(guardarMiVenta)
        .then(() => {
          navigate("/billeteras");
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            formError: "Error al guardar venta, intente nuevamente",
          });
        });
    } catch (error) {
      console.log(error);
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
                  <h1>Formulario de venta</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}

                  <FormGroup>
                    <LabelBS text="Moneda" />
                    <FormControl
                      required
                      type="text"
                      value={monedaNombre}
                      readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                      La moneda es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Valor en USD" />
                    <FormControl
                      required
                      type="number"
                      value={valor}
                      onChange={(e) => setValor(Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">
                      El valor es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Monto" />
                    <FormControl
                      required
                      type="number"
                      value={monto}
                      onChange={(e) => setMonto(Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">
                      El monto es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup className="mt-2">
                    <LabelBS text="Descripción" />
                    <FormControl
                      required
                      type="text"
                      value={metodoPago}
                      onChange={(e) => {
                        setMetodoPago(e.target.value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      La descripción es requerida
                    </Form.Control.Feedback>
                  </FormGroup>

                  <div className="mt-2">
                    <Button type="submit">Guardar</Button>
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

export default VentaForm;
