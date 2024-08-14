import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCommonHeaders } from "../../../utils/serviceUtils";
import {
  getUsuarioById,
  updateUsuario,
} from "../../../services/UsuarioService";
import Menu from "../../../components/Menu";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Row,
  FormCheck,
} from "react-bootstrap";
import LabelBS from "../../../components/LabelBS";

const UsuarioForm = () => {
  const { id } = useParams();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);

  const [usuarioId, setUsuarioId] = useState("");
  const [esAdministrador, setEsAdministrador] = useState("");

  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarioLogueado();
    if (id) {
      fetchUsuario();
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

  const fetchUsuario = () => {
    getUsuarioById(id).then((usuario) => {
      setNombre(usuario.nombre);
      setEmail(usuario.email);
      setPassword(usuario.password);
      setEsAdmin(usuario.esAdmin);
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
    guardarUsuario();
  };

  const guardarUsuario = () => {
    const usuario = {
      nombre,
      email,
      password,
      esAdmin,
    };

    console.log(usuario);

    updateUsuario(id, usuario)
      .then(() => {
        navigate("/usuarios");
      })
      .catch((err) => {
        console.log(err);
        setErrors({
          ...errors,
          formError: "Error al actualizar usuario, intente nuevamente",
        });
      });
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
                  <h1>Editar usuario</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}
                  <FormGroup>
                    <LabelBS text="Nombre" />
                    <FormControl required type="text" value={nombre} readOnly />
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Email" />
                    <FormControl required type="text" value={email} readOnly />
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Password" />
                    <FormControl
                      required
                      type="text"
                      value={password}
                      readOnly
                    />
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Administrador" />
                    <FormCheck
                      type="checkbox"
                      label="Es Administrador"
                      checked={esAdmin}
                      onChange={(e) => setEsAdmin(e.target.checked)}
                    />
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

export default UsuarioForm;
