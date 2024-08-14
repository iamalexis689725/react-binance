import Menu from "../../../components/Menu";
import { Card, Col, Container, Form, Row, Button, FormGroup, FormSelect, FormControl } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBeneficiariosMine } from "../../../services/Beneficiario";
import LabelBS from "../../../components/LabelBS";
import { getBilleterasById, getBilleterasCodigo, updateBilleteraPatch } from "../../../services/BilleteraService";
import { createMovimiento, updateMovimientoPatch } from "../../../services/Movimiento";

const TransferirForm = () => {
  const { id } = useParams();
  const [beneficiarioSeleccionado, setBeneficiarioSeleccionado] = useState("");
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [monto, setMonto] = useState("");

  // Datos de mi billetera
  const [monedaNombre, setMonedaNombre] = useState('');
  const [saldo, setSaldo] = useState('');

  // Datos de la billetera del beneficiario
  const [idBeneficiario, setIdBeneficiario] = useState(0);
  const [monedaNombreBeneficiario, setMonedaNombreBeneficiario] = useState('');
  const [saldoBeneficiario, setSaldoBeneficiario] = useState('');

  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBeneficiarios();
    if (id) {
      fetchMiBilletera();
    }
  }, [id]);

  const fetchBeneficiarios = async () => {
    try {
      const beneficiarioData = await getBeneficiariosMine();
      setBeneficiarios(beneficiarioData);
    } catch (error) {
      console.log("There was an error fetching the beneficiarios!", error);
    }
  };

  const fetchMiBilletera = () => {
    getBilleterasById(id).then((billetera) => {
      setMonedaNombre(billetera.moneda.nombre);
      setSaldo(billetera.saldo);
    });
  }

  const enviarDatos = async (e) => {
    const form = e.currentTarget;
    let isValid = form.checkValidity();
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (!isValid) {
      return;
    }

    try {
      const billetera = await getBilleterasCodigo(beneficiarioSeleccionado);
      setIdBeneficiario(billetera.id);
      setMonedaNombreBeneficiario(billetera.moneda.nombre);
      setSaldoBeneficiario(billetera.saldo);
      guardarTransferencia(billetera.moneda.nombre, billetera.id, billetera.saldo);
    } catch (error) {
      console.log("Error fetching billetera by codigo:", error);
    }
  };

  const guardarTransferencia = async (monedaNombreBeneficiario, beneficiarioid, beneficiarioSaldo) => {
    if (monedaNombre === monedaNombreBeneficiario) {
      if (parseFloat(monto) <= parseFloat(saldo)) {
        const miBilletera = {
          saldo: saldo - monto
        }
        updateBilleteraPatch(id, miBilletera)
          .then((billetera) => {
            setSaldo(billetera.saldo);
          });
        const billeteraBeneficiario = {
          saldo: Number(monto) + Number(beneficiarioSaldo)
        }
        updateBilleteraPatch(beneficiarioid, billeteraBeneficiario)
          .then((billetera) => {
            setSaldoBeneficiario(billetera.saldo);
          });


        const movimientoIngreso = {
          monto: parseFloat(monto),
          tipo: "Transferencia Ingreso 1/2",
          fecha: new Date().toISOString(),
          billetera_id: beneficiarioid,
          movReferencia_id: null,
        }
        const movimientoEgreso = {
          monto: parseFloat(monto),
          tipo: "Transferencia Egreso 2/2",
          fecha: new Date().toISOString(),
          billetera_id: Number(id),
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

        navigate("/billeteras");
      } else {
        alert("No puedes transferir porque el monto excede el saldo disponible");
      }
    } else {
      alert("No se puede transferir porque no tiene el mismo nombre");
    }
  }
  

  return (
    <>
      <Menu />
      <Container>
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h1>Hacer Transferencia</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}

                  <FormGroup className="mt-2">
                    <LabelBS text="Beneficiarios" />
                    <FormSelect
                      required
                      value={beneficiarioSeleccionado}
                      onChange={(e) => {
                        setBeneficiarioSeleccionado(e.target.value);
                      }}
                    >
                      <option value="">Seleccione un beneficiario</option>
                      {beneficiarios.map((beneficiario) => (
                        <option
                          key={"beneficiario-" + beneficiario.id}
                          value={beneficiario.codigoUnico}
                        >
                          {beneficiario.nombreReferencia} {beneficiario.codigoUnico}
                        </option>
                      ))}
                    </FormSelect>
                    <Form.Control.Feedback type="invalid">
                      el beneficiario es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Monto a transferir" />
                    <FormControl
                      required
                      type="number"
                      min="0"
                      step="0.01" // Permitir decimales
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      El monto en USD es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <div className="mt-2">
                    <Button type="submit">Guardar</Button>
                    <Link
                      to="/beneficiario/create"
                      className="btn btn-secondary ml-2"
                    >
                      Crear Beneficiario
                    </Link>
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

export default TransferirForm;
