import { useEffect, useState } from "react";
import { deleteVenta, getVentasMine } from "../../../services/VentasService";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Menu from "../../../components/Menu";
import { estado } from "../../../utils/estadoUtils";

const VentaList = () => {
  const [ventaList, setVentaList] = useState([]);

  useEffect(() => {
    fetchListaVentas();
  }, []);

  const fetchListaVentas = () => {
    getVentasMine().then((res) => {
      setVentaList(res);
    });
  };
  const removeVenta = (id) => {
    const confirmation = window.confirm(
      "¿Estás seguro de eliminar esta venta?"
    );
    if (!confirmation) return;
    deleteVenta(id).then(() => {
      fetchListaVentas();
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
                  <h1>Lista de tus Ventas</h1>
                </Card.Title>
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>nombre moneda</th>
                      <th>monto moneda</th>
                      <th>valor de venta</th>
                      <th>Estado</th>
                      <th>billetera Origen</th>
                      <th>billetera Destino</th>
                      <th></th>
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
                        <td>{estado(venta.estado)}</td>
                        <td>{venta.billeteraOrigen.id}</td>
                        <td>
                          {venta.billeteraDestino
                            ? venta.billeteraDestino.id
                            : ""}
                        </td>
                        <td>
                          {venta.estado === 2 && (
                            <Link
                              className="btn btn-primary"
                              to={"/validar/" + venta.id}
                            >
                              Ver
                            </Link>
                          )}
                        </td>
                        <td>
                          {venta.estado !== 3 && (
                            <Link
                              className="btn btn-primary"
                              to={"/ventas/" + venta.id}
                            >
                              Editar
                            </Link>
                          )}
                        </td>
                        <td>
                          {venta.estado !== 3 && (
                            <Button
                              variant="danger"
                              onClick={() => removeVenta(venta.id)}
                            >
                              Eliminar
                            </Button>
                          )}
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

export default VentaList;
