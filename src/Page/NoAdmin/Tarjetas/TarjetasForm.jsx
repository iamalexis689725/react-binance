import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTarjetaById,
  insertTarjeta,
  luhnCheck,
  updateTarjeta,
} from "../../../services/TarjetasService";
import Menu from "../../../components/Menu";
import LabelBS from "../../../components/LabelBS";
import moment from "moment";
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
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";

const TarjetasForm = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [cvv, setCvv] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarioLogueado();
    if (id) {
      fetchTarjeta();
    }
  }, [id]);

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

  const fetchTarjeta = () => {
    getTarjetaById(id).then((tarjeta) => {
      setNombre(tarjeta.nombre);
      setNumero(tarjeta.numero);
      setCvv(tarjeta.cvv);
      setFechaVencimiento(
        moment.utc(tarjeta.fechaVencimiento).format("YYYY-MM-DD")
      );
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
    guardarTarjeta();
  };

  const guardarTarjeta = () => {
    const validado = luhnCheck(numero);
    console.log(validado);
    if (!validado) {
      setErrors({ ...errors, formError: "Número de tarjeta inválido" });
      return;
    }

    const tarjeta = {
      nombre,
      numero,
      cvv: Number(cvv),
      fechaVencimiento,
      usuario_id: usuarioId, // Asignar el ID del usuario logueado
    };

    console.log(tarjeta);

    if (id) {
      updateTarjeta(id, tarjeta)
        .then(() => {
          navigate("/tarjetas");
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            formError: "Error al actualizar tarjeta, intente nuevamente",
          });
        });
    } else {
      insertTarjeta(tarjeta)
        .then(() => {
          navigate("/tarjetas");
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            formError: "Error al insertar tarjeta, intente nuevamente",
          });
        });
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
                <h1>{id ? "Editar Tarjeta" : "Crear Tarjeta"}</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}
                  <FormGroup>
                    <LabelBS text="Nombre" />
                    <FormControl
                      required
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el nombre es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Numero" />
                    <FormControl
                      required
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el numero es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="CVV" />
                    <FormControl
                      required
                      type="number"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el cvv es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup className="mt-2">
                    <LabelBS text="Fecha de vencimiento" />
                    <FormControl
                      required
                      type="date"
                      value={fechaVencimiento}
                      onChange={(e) => {
                        setFechaVencimiento(e.target.value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      La fecha de vencimiento es requerida
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

export default TarjetasForm;
