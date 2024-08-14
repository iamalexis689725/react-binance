import { useEffect, useState } from "react";
import Menu from "../../../components/Menu";
import { getVentasNoMine } from "../../../services/VentasService";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const ComerciarList = () => {
  const [ventaList, setVentaList] = useState([]);

  useEffect(() => {
    fetchListaVentas();
  }, []);

  const fetchListaVentas = async () => {
    try {
      const res = await getVentasNoMine();
      // Filtra las ventas que no tienen el estado 2 ni 3
      const ventasFiltradas = res.filter(venta => venta.estado !== 2 && venta.estado !== 3);
      setVentaList(ventasFiltradas);
    } catch (error) {
      console.error("Error fetching ventas:", error);
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
                  <h1>Lista de Ventas</h1>
                </Card.Title>
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre Moneda</th>
                      <th>Monto Moneda</th>
                      <th>Valor de Venta</th>
                      <th>Billetera Origen</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventaList.map((venta) => (
                      <tr key={"venta-" + venta.id}>
                        <td>{venta.id}</td>
                        <td>{venta.moneda.nombre}</td>
                        <td>{venta.monto}</td>
                        <td>{venta.valor + " USD"}</td>
                        <td>{venta.billeteraOrigen.id}</td>
                        <td>
                          <Link
                            className="btn btn-primary"
                            to={"/comprar/" + venta.id}
                          >
                            Comprar
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

export default ComerciarList;
