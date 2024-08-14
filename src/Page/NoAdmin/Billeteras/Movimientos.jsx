import { Card, Col, Container, Row, Table } from "react-bootstrap";
import Menu from "../../../components/Menu";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovimientosByBilleteraId } from "../../../services/Movimiento";

const Movimientos = () => {
  const { id } = useParams();
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    fetchListaMovimientos();
  }, []);

  const fetchListaMovimientos = () => {
    getMovimientosByBilleteraId(id).then((res) => {
      // Ordenar movimientos por fecha de manera descendente
      const movimientosOrdenados = res.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setMovimientos(movimientosOrdenados);
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
                  <h1>Tus Movimientos</h1>
                </Card.Title>
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Monto</th>
                      <th>Tipo</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((movimiento) => (
                      <tr key={"movimiento-" + movimiento.id}>
                        <td>{movimiento.id}</td>
                        <td>{movimiento.monto}</td>
                        <td>{movimiento.tipo}</td>
                        <td>
                          {moment.utc(movimiento.fecha).format("DD/MM/YYYY")}
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

export default Movimientos;
