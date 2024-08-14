import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../../../components/Menu";
import { getVentasById, updateVentaPatch } from "../../../services/VentasService";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { getBilleteraById, updateBilleteraPatch } from "../../../services/BilleteraService";
import { createMovimiento, updateMovimientoPatch } from "../../../services/Movimiento";

const VerificacionForm = () => {
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [monto, setMonto] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const ventaData = await getVentasById(id);
        setMonto(ventaData.monto);
        setVenta(ventaData);
      } catch (err) {
        setError(err);
      }
    };

    fetchVenta();
  }, [id]);

  const handleConfirmarVenta = async () => {
    try {
      // Obtener los IDs de las billeteras de origen y destino
      const ventaData = await getVentasById(id);
      const OrigenId = ventaData.billeteraOrigen.id;
      const DestinoId = ventaData.billeteraDestino.id;

      // Obtener los saldos actuales de las billeteras
      const billeteraOrigen = await getBilleteraById(OrigenId);
      const billeteraDestino = await getBilleteraById(DestinoId);

      // Actualizar los saldos de las billeteras
      const actualizarSaldoOrigen = {
        saldo: billeteraOrigen.saldo - monto
      };
      const actualizarSaldoDestino = {
        saldo: billeteraDestino.saldo + monto
      };

      await updateBilleteraPatch(OrigenId, actualizarSaldoOrigen);
      await updateBilleteraPatch(DestinoId, actualizarSaldoDestino);

      // Actualizar el estado de la venta
      const actualizarVenta = { estado: 3 };
      await updateVentaPatch(id, actualizarVenta);

      const movimientoIngreso = {
        monto: parseFloat(monto),
        tipo: "Venta Ingreso 1/2",
        fecha: new Date().toISOString(),
        billetera_id: DestinoId,
        movReferencia_id: null,
      }
      const movimientoEgreso = {
        monto: parseFloat(monto),
        tipo: "Venta Egreso 2/2",
        fecha: new Date().toISOString(),
        billetera_id: OrigenId,
        movReferencia_id: null,
      }

      const movimientoIngresoCreado = await createMovimiento(movimientoIngreso);
      const movimientoEgresoCreado = await createMovimiento(movimientoEgreso);

      console.log(movimientoIngresoCreado.id);//51
      console.log(movimientoEgresoCreado.id);//52

      const MovReferenciaIngreso = {
        movReferencia_id: movimientoEgresoCreado.id
      }
      updateMovimientoPatch(movimientoIngresoCreado.id, MovReferenciaIngreso);

      const MovReferenciaEgreso = {
        movReferencia_id: movimientoIngresoCreado.id
      }
      updateMovimientoPatch(movimientoEgresoCreado.id, MovReferenciaEgreso);

      navigate("/ventas");
    } catch (err) {
      setError(err);
    }
  };

  if (error) {
    return (
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Error</Card.Title>
                <Card.Text>Hubo un error al cargar la venta: {error.message}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!venta) {
    return (
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Cargando...</Card.Title>
                <Card.Text>Por favor, espera mientras se carga la información.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
      <Menu />
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Detalles de la Venta</Card.Title>
                <Card.Text>
                  <strong>Método de Pago:</strong> {venta.metodoDePago}
                </Card.Text>
                <Card.Text>
                  <strong>Moneda:</strong> {venta.moneda.nombre}
                </Card.Text>
                <Card.Text>
                  <strong>Comprobante:</strong>
                </Card.Text>
                {venta.comprobanteURL && (
                  <img src={venta.comprobanteURL} alt="Comprobante" style={{ maxWidth: "100%" }} />
                )}
                <div className="text-center mt-4">
                  <Button onClick={handleConfirmarVenta}>Confirmar Venta</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VerificacionForm;
