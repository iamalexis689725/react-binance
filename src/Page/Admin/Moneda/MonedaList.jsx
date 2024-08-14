import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import Menu from "../../../components/Menu";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteMoneda, getMonedasList } from "../../../services/MonedaService";
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";
import { getUsuarioById } from "../../../services/UsuarioService";

const MonedaList = () => {
  const [monedas, setMonedas] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [esAdministrador, setEsAdministrador] = useState("");
  useEffect(() => {
    fetchUsuarioLogueado();
    fetchListaMonedas();
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

  const fetchListaMonedas = () => {
    getMonedasList().then((res) => {
      setMonedas(res);
    });
  };

  const removeMoneda = (id) => {
    const confirmation = window.confirm("¿Estás seguro de eliminar esta moneda?");
    if (!confirmation) return;
    deleteMoneda(id).then(() => {
      fetchListaMonedas();
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
                    Monedas
                    <Button
                      className="ms-3"
                      variant="primary"
                      as={Link}
                      to="/monedas/create"
                    >
                      Crear Moneda
                    </Button>
                  </h1>
                </Card.Title>
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Valor USD</th>
                      <th>Valor Moneda</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {monedas.map((moneda) => (
                      <tr key={"moneda-" + moneda.id}>
                        <td>{moneda.id}</td>
                        <td>{moneda.nombre}</td>
                        <td>{moneda.valorUSD}</td>
                        <td>{moneda.valorMoneda}</td>
                        <td>
                          <Link className="btn btn-primary" to={"/monedas/" + moneda.id}>
                            Editar
                          </Link>
                        </td>
                        <td>
                          <Button variant="danger" onClick={() => removeMoneda(moneda.id)}>
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

export default MonedaList;
