import { useEffect, useState } from "react";
import { deleteTarjeta, getTarjetasMine } from "../../../services/TarjetasService";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Menu from "../../../components/Menu";
import moment from "moment";

const TarjetaList = () => {
    const [tarjetaList, setTarjetaList] = useState([])

    useEffect(() => {
        fetchListaTarjetas();
    }, [])


    const fetchListaTarjetas = () => {
        getTarjetasMine()
            .then((res) => {
                setTarjetaList(res);
            });
    }
    const removeTarjeta = (id) => {
        const confirmation = window.confirm('¿Estás seguro de eliminar esta tarjeta?');
        if (!confirmation) return;
        deleteTarjeta(id).then(() => {
            fetchListaTarjetas();
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
                                    <h1>Lista de Tarjetas</h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Nombre</th>
                                            <th>Numero</th>
                                            <th>CVV</th>
                                            <th>fecha de vencimiento</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tarjetaList.map((tarjeta) =>
                                            <tr key={"tarjeta-" + tarjeta.id}>
                                                <td>{tarjeta.id}</td>
                                                <td>{tarjeta.nombre}</td>
                                                <td>{tarjeta.numero}</td>
                                                <td>{tarjeta.cvv}</td>
                                                <td>{moment.utc(tarjeta.fechaVencimiento).format("DD/MM/YYYY")}</td>
                                                <td><Link className="btn btn-primary" to={"/tarjetas/" + tarjeta.id}>Editar</Link></td>
                                                <td>
                                                    <Button variant="danger" onClick={() => removeTarjeta(tarjeta.id)}>
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

export default TarjetaList;