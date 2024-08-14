import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import Menu from "../../../components/Menu";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LabelBS from "../../../components/LabelBS";
import { getVentasById, updateVentaPatch } from "../../../services/VentasService";
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";
import { getBilleteraById, getBilleterasById } from "../../../services/BilleteraService";

const EditVentaForm = () => {
  const { id } = useParams();

  const [valor, setValor] = useState('');
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('');

  const [billeteraID, setBilleteraID] = useState('')
  const [saldoBilletera, setSaldoBilletera] = useState('');

  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [usuarioId, setUsuarioId] = useState("");

  useEffect(() => {
    fetchUsuarioLogueado();
    if (id) {
      fetchVentas();
    }
  }, [id])

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

  const fetchVentas = () => {
    getVentasById(id).then((venta) => {
      setValor(venta.valor);
      setMonto(venta.monto);
      setMetodoPago(venta.metodoDePago);
      setBilleteraID(venta.billeteraOrigen.id);
      console.log(venta.billeteraOrigen.id);
    });
  }

  const enviarDatos = async (e) => {
    const form = e.currentTarget;
    let isValid = form.checkValidity();
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (!isValid) {
      return;
    }

    try {
      const venta = await getVentasById(id);
      setBilleteraID(venta.billeteraOrigen.id);

      const billetera = await getBilleteraById(venta.billeteraOrigen.id);
      setSaldoBilletera(billetera.saldo);

      // Verifica si el monto de la venta es mayor que el saldo de la billetera
      if (monto > billetera.saldo) {
        setErrors({
          ...errors,
          formError: "Saldo insuficiente en la billetera",
        });
        return;
      }

      editarVenta();
    } catch (error) {
      console.log("Error fetching data:", error);
      setErrors({
        ...errors,
        formError: "Error al obtener los datos, intente nuevamente",
      });
    }
  };

  const editarVenta = () => {
    const venta = {
      valor,
      monto,
      metodoDePago: metodoPago
    };
    if (id) {
      updateVentaPatch(id, venta)
        .then(() => {
          navigate("/ventas")
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            formError: "Error al actualizar venta, intente nuevamente",
          });
        });
    }
  }

  return (
    <>
      <Menu />
      <Container>
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h1>Editar venta</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}

                  <FormGroup>
                    <LabelBS text="valor en USD" />
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
                    <LabelBS text="descripcion" />
                    <FormControl
                      required
                      type="text"
                      value={metodoPago}
                      onChange={(e) => {
                        setMetodoPago(e.target.value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      la descripcion es requerido
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

export default EditVentaForm;
