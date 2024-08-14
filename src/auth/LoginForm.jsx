import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { postLogin, getCurrentUser, getAdminById } from "../services/AuthService";
import Menu from "../components/Menu";
import LabelBS from "../components/LabelBS";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});


  const enviarDatos = (e) => {
    const form = e.currentTarget;
    let isValid = form.checkValidity();

    e.preventDefault();
    e.stopPropagation();

    setValidated(true);

    if (!isValid) {
      return;
    }
    doLogin();
  };

  const doLogin = () => {
    const credentials = {
        email,
        password
    };

    postLogin(credentials)
        .then((res) => {
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('username', email);

            // Obtener los datos del usuario actual
            getCurrentUser()
                .then((userData) => {
                    const idUsuarioLogueado = userData.sub; // Obtener el ID del usuario
                    console.log(idUsuarioLogueado);

                    getAdminById(idUsuarioLogueado)
                        .then((resultado) => {
                            console.log(resultado)
                            // Determinar la ruta basada en el rol de usuario (esAdmin)
                            if (resultado.esAdmin) {
                                navigate('/admin');
                            } else {
                                navigate('/billeteras');
                            }
                        }).catch((error) => {
                            console.error("Error al obtener los datos del usuario:", error);
                            setErrors({ ...errors, formError: 'Error en el inicio de sesión' });
                        });
                })
                .catch((error) => {
                    console.error("Error al obtener los datos del usuario:", error);
                    setErrors({ ...errors, formError: 'Error en el inicio de sesión' });
                });
        }).catch((err) => {
            console.error(err);
            if (err.response && err.response.status === 401) {
                setErrors({ ...errors, formError: 'Usuario o contraseña incorrectos' });
            } else {
                setErrors({ ...errors, formError: 'Error en el inicio de sesión' });
            }
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
                  <h1>Iniciar sesión</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}
                  <FormGroup>
                    <LabelBS text="Correo" />
                    <FormControl
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Ingrese un correo válido
                    </Form.Control.Feedback>
                  </FormGroup>
                  <FormGroup className="mt-2">
                    <LabelBS text="Contraseña" />
                    <FormControl
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Ingrese una contraseña válida
                    </Form.Control.Feedback>
                  </FormGroup>
                  <div className="mt-2">
                    <Button type="submit">Iniciar sesión</Button>
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

export default LoginForm;
