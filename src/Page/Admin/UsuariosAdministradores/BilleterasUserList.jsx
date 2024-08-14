import { Card, Col, Container, Row, Table } from "react-bootstrap";
import Menu from "../../../components/Menu";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBilleterasUsuarioId } from "../../../services/BilleteraService";
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";
import { getUsuarioById } from "../../../services/UsuarioService";

const BilleterasUserList = () => {
  const { id } = useParams();
  const [billeteras, setBilleteras] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [esAdministrador, setEsAdministrador] = useState("");

  useEffect(() => {
    const fetchBilleteras = async () => {
      try {
        const billeterasData = await getBilleterasUsuarioId(id);
        setBilleteras(billeterasData);
        console.log(billeterasData);
      } catch (error) {
        console.error("There was an error fetching the billeteras!", error);
      }
    };
    fetchBilleteras();
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
                  <h1>Billetera</h1>
                </Card.Title>
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>saldo</th>
                      <th>valor USD</th>
                      <th>Codigo</th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {billeteras.map((billetera) => (
                      <tr key={"billetera-" + billetera.id}>
                        <td>{billetera.id}</td>
                        <td>{billetera.moneda.nombre}</td>
                        <td>{billetera.saldo}</td>
                        <td>{billetera.valorEnUSD.toFixed(2)}</td>
                        <td>{billetera.codigo}</td>
                        <td>
                          <Link
                            className="btn btn-primary"
                            to={"/movimientos/" + billetera.id}
                          >
                            Movimientos de billetera
                          </Link>
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

export default BilleterasUserList;
