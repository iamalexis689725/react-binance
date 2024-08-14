import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCuentaById,
  insertCuenta,
  updateCuenta,
} from "../../../services/CuentasService";
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
  Row,
} from "react-bootstrap";
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";

const CuentasForm = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [documentoIdentidad, setDocumentoIdentidad] = useState("");
  const [banco, setBanco] = useState("");
  const [moneda, setMoneda] = useState("");
  const [usuarioId, setUsuarioId] = useState("");

  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarioLogueado();
    if (id) {
      fetchCuenta();
    }
  }, [id]);
  const fetchCuenta = () => {
    getCuentaById(id).then((cuenta) => {
      setNombre(cuenta.nombre);
      setNumeroCuenta(cuenta.numeroCuenta);
      setDocumentoIdentidad(cuenta.documentoIdentidad);
      setBanco(cuenta.banco);
      setMoneda(cuenta.moneda);
      console.log(cuenta);
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
    guardarCuenta();
  };

  const guardarCuenta = () => {
    const cuenta = {
      numeroCuenta,
      nombre,
      documentoIdentidad,
      banco,
      moneda,
      usuario_id: usuarioId, // Asignar el ID del usuario logueado
    };
    console.log(cuenta);

    if (id) {
      updateCuenta(id, cuenta)
        .then(() => {
          navigate("/cuenta");
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            formError: "Error al actualizar cuenta, intente nuevamente",
          });
        });
    } else {
      insertCuenta(cuenta)
        .then(() => {
          navigate("/cuenta");
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            formError: "Error al insertar cuenta, intente nuevamente",
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
                <h1>{id ? "Editar Cuenta" : "Crear Cuenta"}</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}

                  <FormGroup>
                    <LabelBS text="numero de cuenta" />
                    <FormControl
                      required
                      type="text"
                      value={numeroCuenta}
                      onChange={(e) => setNumeroCuenta(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el numero de cuenta es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

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
                    <LabelBS text="documento de Identidad" />
                    <FormControl
                      required
                      type="text"
                      value={documentoIdentidad}
                      onChange={(e) => setDocumentoIdentidad(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el documento de Identidad es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="banco" />
                    <FormControl
                      required
                      type="text"
                      value={banco}
                      onChange={(e) => setBanco(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el banco es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup className="mt-2">
                    <LabelBS text="moneda" />
                    <FormControl
                      required
                      type="text"
                      value={moneda}
                      onChange={(e) => {
                        setMoneda(e.target.value);
                      }}
                    />
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

export default CuentasForm;
