import { useEffect } from "react";
import { useState } from "react";
import { deleteCuenta, getCuentasMine } from "../../../services/CuentasService";
import Menu from "../../../components/Menu";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const CuentasList = () => {
    const [cuentaList, setCuentaList] = useState([])

    useEffect(() => {
        fetchListaCuentas();
    }, [])
    const fetchListaCuentas = () => {
        getCuentasMine()
            .then((res) => {
                setCuentaList(res);
            });
    }
    const removeCuenta = (id) => {
        const confirmation = window.confirm('¿Estás seguro de eliminar esta cuenta?');
        if (!confirmation) return;
        deleteCuenta(id).then(() => {
            fetchListaCuentas();
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
                                    <h1>Lista de Cuentas</h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Numero de cuenta</th>
                                            <th>nombre</th>
                                            <th>documento de identidad</th>
                                            <th>Banco</th>
                                            <th>moneda</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cuentaList.map((cuenta) =>
                                            <tr key={"cuenta-" + cuenta.id}>
                                                <td>{cuenta.id}</td>
                                                <td>{cuenta.numeroCuenta}</td>
                                                <td>{cuenta.nombre}</td>
                                                <td>{cuenta.documentoIdentidad}</td>
                                                <td>{cuenta.banco}</td>
                                                <td>{cuenta.moneda}</td>
                                                <td><Link className="btn btn-primary" to={"/cuentas/" + cuenta.id}>Editar</Link></td>
                                                <td>
                                                    <Button variant="danger" onClick={() => removeCuenta(cuenta.id)}>
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

export default CuentasList;