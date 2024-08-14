import {
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  FormSelect,
  Row,
  Button,
} from "react-bootstrap";
import Menu from "../../../components/Menu";
import LabelBS from "../../../components/LabelBS";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { generateUuid, getCommonHeaders } from "../../../utils/serviceUtils";
import { getMonedasList } from "../../../services/MonedaService";
import { createBilletera } from "../../../services/BilleteraService";

const BilleterasForm = () => {
  const { id } = useParams();
  const [usuarioId, setUsuarioId] = useState("");
  const [monedaSeleccionada, setMonedaSeleccionada] = useState("");
  const [monedas, setMonedas] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [codigo, setCodigo] = useState("");

  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarioLogueado();
    fetchMonedas();
  }, []);
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

  const fetchMonedas = () => {
    getMonedasList()
      .then((data) => {
        setMonedas(data);
      })
      .catch((error) => {
        console.error("Error fetching monedas", error);
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
    guardarBilletera();
  };

  const guardarBilletera = () => {
    const billetera = {
      usuario_id: Number(usuarioId),
      moneda_id: Number(monedaSeleccionada),
      saldo,
      codigo: generateUuid(),
    };

    console.log(billetera);

    createBilletera(billetera)
      .then(() => {
        navigate("/billeteras");
      })
      .catch((err) => {
        console.log(err);
        setErrors({
          ...errors,
          formError: "Error al insertar billetera, intente nuevamente",
        });
      });
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
                  <h1>Crear Billeteras</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}

                  <FormGroup className="mt-2">
                    <LabelBS text="Moneda" />
                    <FormSelect
                      required
                      value={monedaSeleccionada}
                      onChange={(e) => {
                        setMonedaSeleccionada(e.target.value);
                      }}
                    >
                      <option value="">Seleccione una moneda</option>
                      {monedas.map((moneda) => (
                        <option key={"moneda-" + moneda.id} value={moneda.id}>
                          {moneda.nombre}
                        </option>
                      ))}
                    </FormSelect>
                    <Form.Control.Feedback type="invalid">
                      La moneda es requerida
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

export default BilleterasForm;
