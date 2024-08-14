import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  NavDropdown,
  Navbar,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { getUsuarioById } from "../services/UsuarioService";

const Menu = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [persona, setPersona] = useState(null);
  const [userId, setUserId] = useState(null);
  const [esAdministrador, setEsAdministrador] = useState(null);

  const cerrarSesionClicked = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    navigate("/login");
  };
  useEffect(() => {
    if (persona) {
      return;
    }
    getUserInfo();
  }, []);
  const getUserInfo = () => {
    axios
      .get("http://localhost:3000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPersona(res.data);
        setUserId(res.data.sub);
        console.log(res.data.sub);
        getUsuario(res.data.sub);
      });
  };
  const getUsuario = (usuarioid) => {
    getUsuarioById(usuarioid)
      .then((usuario) => {
        setEsAdministrador(usuario.esAdmin);
      })
      .catch((error) => {
        console.error("Error fetching monedas", error);
      });
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md">
      <Container>
        <Navbar.Brand href="#home">Binance</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token ? (
              <>
                <NavDropdown title="Billetera" id="basic-nav-dropdown">
                  <NavLink
                    end
                    className={"dropdown-item"}
                    to="/billeteras/create"
                  >
                    Crear Billetera
                  </NavLink>
                  <NavLink end className={"dropdown-item"} to="/billeteras">
                    Mis Billeteras
                  </NavLink>
                </NavDropdown>
                <NavDropdown title="Tarjeta" id="basic-nav-dropdown">
                  <NavLink
                    end
                    className={"dropdown-item"}
                    to="/tarjetas/create"
                  >
                    Crear tarjeta
                  </NavLink>
                  <NavLink end className={"dropdown-item"} to="/tarjetas">
                    Mis Tarjetas
                  </NavLink>
                </NavDropdown>
                <NavDropdown title="Cuenta" id="basic-nav-dropdown">
                  <NavLink end className={"dropdown-item"} to="/cuenta/create">
                    Crear Cuenta
                  </NavLink>
                  <NavLink end className={"dropdown-item"} to="/cuenta">
                    Mis Cuentas
                  </NavLink>
                </NavDropdown>
                <NavDropdown title="Beneficiarios" id="basic-nav-dropdown">
                  <NavLink
                    end
                    className={"dropdown-item"}
                    to="/beneficiario/create"
                  >
                    Crear Beneficiarios
                  </NavLink>
                  <NavLink end className={"dropdown-item"} to="/beneficiarios">
                    Mis beneficiarios
                  </NavLink>
                </NavDropdown>
                <NavDropdown title="Ventas" id="basic-nav-dropdown">
                  <NavLink end className={"dropdown-item"} to="/ventas">
                    Mis ventas
                  </NavLink>
                  <NavLink end className={"dropdown-item"} to="/comprar">
                    Comprar
                  </NavLink>
                </NavDropdown>
                {esAdministrador === true && (
                  <NavDropdown title="Administradores" id="basic-nav-dropdown">
                    <NavLink end className={"dropdown-item"} to="/monedas">
                      CONFIGURACION MONEDA
                    </NavLink>
                    <NavLink end className={"dropdown-item"} to="/usuarios">
                      CONFIGURACION USUARIOS
                    </NavLink>
                  </NavDropdown>
                )}
                <NavLink className={"nav-link"}>
                  {persona && <>{persona.username}</>}
                </NavLink>
                <button
                  onClick={cerrarSesionClicked}
                  className="btn btn-link nav-link"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink end className={"nav-link"} to="/login">
                  Iniciar sesión
                </NavLink>
                <NavLink end className={"nav-link"} to="/register">
                  Registrarse
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
