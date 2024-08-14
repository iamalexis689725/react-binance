import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Menu from "../../../components/Menu";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  FormGroup,
  FormControl,
  FormSelect,
} from "react-bootstrap";
import {
  getVentasById,
  updateVentaPatch,
  uploadComprobante,
} from "../../../services/VentasService";
import { useNavigate, useParams } from "react-router-dom";
import LabelBS from "../../../components/LabelBS";
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";
import {
  getBilleteraById,
  getBilleterasCodigo,
  getBilleterasMine,
} from "../../../services/BilleteraService";

const ComerciarForm = () => {
  const { id } = useParams();
  const [usuarioId, setUsuarioId] = useState("");
  const [file, setFile] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [monedaNombre, setMonedaNombre] = useState("");

  const [billeteraSeleccionada, setBilleteraSeleccionada] = useState("");
  const [billeteras, setBilleteras] = useState([]);
  const [billeteraDestinoId, setBilleteraDestinoId] = useState("");

  const [monedaNombreBilletera, setMonedaNombreBilletera] = useState("");

  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsuarioLogueado();
    fetchBilleteras();
    if (id) {
      fetchVenta();
    }
  }, [id]);

  const fetchUsuarioLogueado = () => {
    axios
      .get("http://localhost:3000/auth/me", getCommonHeaders())
      .then((response) => {
        setUsuarioId(response.data.sub);
      })
      .catch((error) => {
        console.error("Error fetching logged in user", error);
      });
  };

  const fetchVenta = () => {
    getVentasById(id).then((venta) => {
      setDescripcion(venta.metodoDePago);
      setMonedaNombre(venta.moneda.nombre);
    });
  };

  const fetchBilleteras = async () => {
    try {
      const billeteraData = await getBilleterasMine();
      setBilleteras(billeteraData);
    } catch (error) {
      console.log("There was an error fetching the billeteras!", error);
    }
  };

  // Función para manejar el drop de archivos
  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(
      Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
      })
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const actualizarVentaComprador = async (nombreMoneda, destinoBilletera) => {
    console.log(destinoBilletera)
    if (nombreMoneda === monedaNombre) {
      if (file && id) {
        uploadComprobante(id, file)
          .then((res) => {
            console.log("Archivo subido exitosamente:", res);
            const actualizarVenta = {
              billeteraDestino_id: Number(destinoBilletera),
              estado: 2
            }
            console.log(actualizarVenta);
            updateVentaPatch(id, actualizarVenta)
            navigate("/billeteras");
          })
          .catch((error) => {
            console.error("Error al subir archivo:", error);
          });
      } else {
        console.error(
          "Debe seleccionar un archivo y tener un ID de venta válido."
        );
      }
    } else {
      alert("No se puede transferir porque no tiene el mismo nombre");
    }
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    let isValid = form.checkValidity();
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (!isValid) {
      return;
    }

    console.log(billeteraSeleccionada);

    try {
      const billetera = await getBilleterasCodigo(billeteraSeleccionada);
      setBilleteraDestinoId(billetera.id);
      setMonedaNombreBilletera(billetera.moneda.nombre);
      actualizarVentaComprador(billetera.moneda.nombre, billetera.id);
    } catch (error) {
      console.log("Error fetching billetera by codigo:", error);
    }
  };

  return (
    <>
      <Menu />
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h1>Formulario de Comerciar</h1>
                </Card.Title>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <FormGroup className="mt-2">
                    <LabelBS text="Billeteras" />
                    <FormSelect
                      required
                      value={billeteraSeleccionada}
                      onChange={(e) => {
                        setBilleteraSeleccionada(e.target.value);
                      }}
                    >
                      <option value="">Seleccione una billetera</option>
                      {billeteras.map((billetera) => (
                        <option
                          key={"billetera-" + billetera.id}
                          value={billetera.codigo}
                        >
                          {billetera.moneda.nombre} {billetera.codigo}
                        </option>
                      ))}
                    </FormSelect>
                    <Form.Control.Feedback type="invalid">
                      La billetera es requerida
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup className="mt-2">
                    <LabelBS text="Descripción" />
                    <FormControl
                      required
                      type="text"
                      value={descripcion}
                      readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                      La descripción es requerida
                    </Form.Control.Feedback>
                  </FormGroup>

                  <Form.Group>
                    <Form.Label>Subir archivo</Form.Label>
                    <div {...getRootProps()} style={dropzoneStyles}>
                      <input {...getInputProps()} />
                      {file ? (
                        <div className="text-center">
                          <img
                            src={file.preview}
                            alt="Vista previa"
                            style={previewStyle}
                          />
                        </div>
                      ) : (
                        <p className="text-center">
                          Arrastra y suelta una imagen aquí, o haz clic para
                          seleccionarla
                        </p>
                      )}
                    </div>
                  </Form.Group>
                  <div className="text-center">
                    <Button type="submit">Guardar</Button>
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

const dropzoneStyles = {
  border: "2px dashed #cccccc",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  marginBottom: "20px",
};

const previewStyle = {
  maxWidth: "100%",
  maxHeight: "200px",
  marginTop: "20px",
};

export default ComerciarForm;
