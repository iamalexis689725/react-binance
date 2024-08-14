import { useEffect, useState } from "react";
import { deleteUsuario, getUsuarioById, getUsuarioList } from "../../../services/UsuarioService";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import Menu from "../../../components/Menu";
import { Link } from "react-router-dom";
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [esAdministrador, setEsAdministrador] = useState("");


  useEffect(() => {
    fetchListaUsuarios();
    fetchUsuarioLogueado();
  }, []);
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

  const fetchListaUsuarios = () => {
    getUsuarioList().then((res) => {
      setUsuarios(res);
      console.log(res);
    });
  };

  const removeUsuario = (id) => {
    const confirmation = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmation) return;
    deleteUsuario(id).then(() => {
      fetchListaUsuarios();
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
                  <h1>
                    Usuarios
                  </h1>
                </Card.Title>
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Administrador</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={"usuario-" + usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.password}</td>
                        <td>{usuario.esAdmin ? "Sí" : "No"}</td>
                        <td>
                          <Link className="btn btn-primary" to={"/billeteras/" + usuario.id}>
                            Ver Billeteras
                          </Link>
                        </td>
                        <td>
                          <Link className="btn btn-primary" to={"/usuarios/" + usuario.id}>
                            Editar
                          </Link>
                        </td>
                        <td>
                          <Button variant="danger" onClick={() => removeUsuario(usuario.id)}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      )}
    </>
  );
};

export default UsuariosList;
