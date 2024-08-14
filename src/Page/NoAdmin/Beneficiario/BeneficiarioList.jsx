import { useEffect } from "react";
import { useState } from "react";
import { deleteBeneficiario, getBeneficiariosMine } from "../../../services/Beneficiario";
import Menu from "../../../components/Menu";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const BeneficiarioList = () => {
    const [beneficiarioList, setBeneficiarioList] = useState([])

    useEffect(() => {
        fetchListaBeneficiarios();
    }, [])
    const fetchListaBeneficiarios = () => {
        getBeneficiariosMine()
            .then((res) => {
                setBeneficiarioList(res);
            });
    }
    const removeBeneficiario = (id) => {
        const confirmation = window.confirm('¿Estás seguro de eliminar este beneficiario?');
        if (!confirmation) return;
        deleteBeneficiario(id).then(() => {
            fetchListaBeneficiarios();
        });
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
                                    <h1>Lista de Beneficiarios</h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>nombre</th>
                                            <th>Codigo de beneficiario</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {beneficiarioList.map((beneficiario) =>
                                            <tr key={"beneficiario-" + beneficiario.id}>
                                                <td>{beneficiario.id}</td>
                                                <td>{beneficiario.nombreReferencia}</td>
                                                <td>{beneficiario.codigoUnico}</td>
                                                <td><Link className="btn btn-primary" to={"/beneficiario/" + beneficiario.id}>Editar</Link></td>
                                                <td>
                                                    <Button variant="danger" onClick={() => removeBeneficiario(beneficiario.id)}>
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>);
}

export default BeneficiarioList;