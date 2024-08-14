import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import Menu from "../../../components/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LabelBS from "../../../components/LabelBS";
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";
import { getMonedaById, insertMoneda, updateMoneda } from "../../../services/MonedaService";
import { getUsuarioById } from "../../../services/UsuarioService";

const MonedaForm = () => {
  const { id } = useParams();

  const [nombre, setNombre] = useState("");
  const [valorUSD, setValorUSD] = useState("");
  const [valorMoneda, setValorMoneda] = useState("");
  const [usuarioId, setUsuarioId] = useState("");

  const [esAdministrador, setEsAdministrador] = useState("");

  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarioLogueado();
    if (id) {
      fetchMoneda();
    }
  }, [id]);

  const fetchUsuarioLogueado = () => {
    axios
      .get("http://localhost:3000/auth/me", getCommonHeaders())
      .then((response) => {
        setUsuarioId(response.data.sub);
        fetchEsAdmin(response.data.sub);
      })
      .catch((error) => {
        console.error("Error fetching logged in user", error);
      });
  };
  const fetchEsAdmin = (id) => {
    getUsuarioById(id).then((usuario) => {
      setEsAdministrador(usuario.esAdmin);
    });
  }

  const fetchMoneda = () => {
    getMonedaById(id).then((moneda) => {
      setNombre(moneda.nombre);
      setValorUSD(moneda.valorUSD);
      setValorMoneda(moneda.valorMoneda);
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
    guardarMoneda();
  };

  const guardarMoneda = () => {
    const moneda = {
      nombre,
      valorUSD: parseFloat(valorUSD), // Convertir valorUSD a número
      valorMoneda: parseFloat(valorMoneda)
    };

    console.log(moneda);

    if (id) {
      updateMoneda(id, moneda)
        .then(() => {
          navigate("/monedas");
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            formError: "Error al actualizar moneda, intente nuevamente",
          });
        });
    } else {
      insertMoneda(moneda)
        .then(() => {
          navigate("/monedas");
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
      {!esAdministrador === false && (
        <Container>
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h1>{id ? "Editar Moneda" : "Crear Moneda"}</h1>
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
                    <LabelBS text="Valor USD" />
                    <FormControl
                      required
                      type="text"
                      value={valorUSD}
                      onChange={(e) => setValorUSD(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el valor en USD es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Valor Moneda" />
                    <FormControl
                      required
                      type="text"
                      value={valorMoneda}
                      onChange={(e) => setValorMoneda(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el valor en moneda es requerido
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
      )}
    </>
  );
};

export default MonedaForm;
