import Menu from "../../components/Menu";

const principalAdmin = () => {
    return (
        <>
            <Menu/>
            <h1>BIENVENIDO ERES UN USUARIO ADMINISTRADOR</h1>
            <h3>Aparte de ser usuario normal como administrador puedes hacer lo siguiente</h3>
            <ul>
                <li>Ver moneda</li>
                <li>Crear moneda</li>
                <li>Editar moneda</li>
                <li>Eliminar moneda</li>

                <li>Ver usuarios</li>
                <li>Convertir usuario a administrador o usuarios normales</li>
                <li>Eliminar usuarios</li>
            </ul>
        </>
    );
}

export default principalAdmin;
