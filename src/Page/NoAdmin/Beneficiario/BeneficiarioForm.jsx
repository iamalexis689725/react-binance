import { useEffect, useState } from "react";
import Menu from "../../../components/Menu";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getCommonHeaders } from "../../../utils/serviceUtils";
import {
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Row,
} from "react-bootstrap";
import LabelBS from "../../../components/LabelBS";
import { Button } from "react-bootstrap";
import {
  createBeneficiario,
  getBeneficiarioById,
  updateBeneficiario,
} from "../../../services/Beneficiario";
import { getBilleterasCodigo } from "../../../services/BilleteraService";

const BeneficiariosForm = () => {
  const { id } = useParams();
  const [nombreReferencia, setNombreReferencia] = useState("");
  const [codigoUnico, setCodigoUnico] = useState("");
  const [usuarioId, setUsuarioId] = useState("");

  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarioLogueado();
    if (id) {
      fetchBeneficiario();
    }
  }, [id]);
  const fetchBeneficiario = () => {
    getBeneficiarioById(id).then((beneficiario) => {
      setNombreReferencia(beneficiario.nombreReferencia);
      setCodigoUnico(beneficiario.codigoUnico);
    });
  };

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

  const enviarDatos = (e) => {
    const form = e.currentTarget;
    let isValid = form.checkValidity();
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (!isValid) {
      return;
    }
    if (form.checkValidity() && codigoUnico.trim() !== "") {
      verificarBeneficiario(codigoUnico.trim());
    } else {
      setErrors({
        ...errors,
        formError: "El código es requerido",
      });
    }
  };

  const verificarBeneficiario = (codigo) => {
    getBilleterasCodigo(codigo)
      .then(() => {
        guardarBeneficiario();
      })
      .catch((err) => {
        console.log(err);
        setErrors({
          ...errors,
          formError: "No encontramos la billetera, intente nuevamente",
        });
      });
  };

  const guardarBeneficiario = () => {
    const beneficiario = {
      nombreReferencia: nombreReferencia,
      codigoUnico: codigoUnico,
      usuario_id: Number(usuarioId),
    };

    console.log(beneficiario);

    if (id) {
      updateBeneficiario(id, beneficiario)
        .then(() => {
          navigate("/beneficiarios");
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            formError: "Error al actualizar beneficiario, intente nuevamente",
          });
        });
    } else {
      createBeneficiario(beneficiario)
        .then(() => {
          navigate("/billeteras");
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            formError: "Error al insertar beneficiario, intente nuevamente",
          });
        });
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
                  <h1>{id ? "Editar Beneficiario" : "Crear Beneficiario"}</h1>
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                  {errors.formError && (
                    <p className="text-danger">{errors.formError}</p>
                  )}

                  <FormGroup>
                    <LabelBS text="Nombre" />
                    <FormControl
                      required
                      type="text"
                      value={nombreReferencia}
                      onChange={(e) => setNombreReferencia(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el nombre es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <FormGroup>
                    <LabelBS text="Codigo" />
                    <FormControl
                      required
                      type="text"
                      value={codigoUnico}
                      onChange={(e) => setCodigoUnico(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      el codigo es requerido
                    </Form.Control.Feedback>
                  </FormGroup>

                  <div className="mt-2">
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

export default BeneficiariosForm;
