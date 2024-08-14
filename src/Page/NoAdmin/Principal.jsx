import { useEffect, useState } from "react";
import Menu from "../../components/Menu";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getBilleterasMine } from "../../services/BilleteraService";

const Principal = () => {
  const [billeteras, setBilleteras] = useState([]);

  useEffect(() => {
    const fetchBilleteras = async () => {
      try {
        const billeterasData = await getBilleterasMine();
        setBilleteras(billeterasData);
      } catch (error) {
        console.error("There was an error fetching the billeteras!", error);
      }
    };
    fetchBilleteras();
  }, []);

  return (
    <>
      <Menu />
      <Container>
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h1>Tus billeteras</h1>
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
                            to={"/deposito/" + billetera.id}
                          >
                            Depositar
                          </Link>
                        </td>
                        <td>
                          <Link
                            className="btn btn-primary"
                            to={"/retiro/" + billetera.id}
                          >
                            Retirar
                          </Link>
                        </td>
                        <td>
                          <Link
                            className="btn btn-primary"
                            to={"/comerciar/" + billetera.id}
                          >
                            Comerciar
                          </Link>
                        </td>
                        <td>
                          <Link
                            className="btn btn-primary"
                            to={"/transferir/" + billetera.id}
                          >
                            Transferir
                          </Link>
                        </td>
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
    </>
  );
};

export default Principal;
