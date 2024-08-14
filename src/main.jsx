import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import Page404 from './Page/Page404';
import Dashboard from './Page/Dashboard';
import RegisterForm from './auth/RegisterForm';
import LoginForm from './auth/LoginForm';
import Principal from './Page/NoAdmin/Principal';
import PrincipalAdmin from './Page/Admin/principalAdmin';
import DepositoForm from './Page/NoAdmin/Billeteras/DepositoForm';
import TarjetasForm from './Page/NoAdmin/Tarjetas/TarjetasForm';
import TarjetaList from './Page/NoAdmin/Tarjetas/TarjetasList';
import CuentasList from './Page/NoAdmin/Cuentas/CuentasList';
import CuentasForm from './Page/NoAdmin/Cuentas/CuentasForm';
import RetiroForm from './Page/NoAdmin/Billeteras/RetiroForm';
import BilleterasForm from './Page/NoAdmin/Billeteras/BilleterasForm';
import TransferirForm from './Page/NoAdmin/Billeteras/TransferirForm';
import BeneficiarioForm from './Page/NoAdmin/Beneficiario/BeneficiarioForm';
import BeneficiarioList from './Page/NoAdmin/Beneficiario/BeneficiarioList';
import VentaForm from './Page/NoAdmin/Ventas/VentaForm';
import VentaList from './Page/NoAdmin/Ventas/VentaList';
import EditVentaForm from './Page/NoAdmin/Ventas/EditVentaForm';
import ComerciarList from './Page/NoAdmin/Billeteras/ComerciarList';
import ComerciarForm from './Page/NoAdmin/Billeteras/ComerciarForm';
import VerificacionForm from './Page/NoAdmin/Billeteras/VerificacionForm';
import Movimientos from './Page/NoAdmin/Billeteras/Movimientos';
import MonedaList from './Page/Admin/Moneda/MonedaList';
import MonedaForm from './Page/Admin/Moneda/MonedaForm';
import UsuariosList from './Page/Admin/UsuariosAdministradores/UsuariosList';
import UsuarioForm from './Page/Admin/UsuariosAdministradores/UsuarioForm';
import BilleterasUserList from './Page/Admin/UsuariosAdministradores/BilleterasUserList';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard/>
  },
  {
    path: "/hola",
    element: <App />
  },
  {
    path: "*",
    element: <Page404 />
  },
  {
    path: "/register",
    element: <RegisterForm/>
  },
  {
    path: "/login",
    element: <LoginForm/>
  },
  {
    path: "/admin",
    element: <PrincipalAdmin/>
  },
  {
    path: "/billeteras",
    element: <Principal/>
  },
  {
    path: "/tarjetas",
    element: <TarjetaList/>
  },
  {
    path: "/tarjetas/create",
    element: <TarjetasForm/>
  },
  {
    path: "/tarjetas/:id",
    element: <TarjetasForm/>
  },
  {
    path: "/deposito/:id",
    element: <DepositoForm/>
  },
  {
    path: "cuenta",
    element: <CuentasList/>
  },
  {
    path: "cuenta/create",
    element: <CuentasForm/>
  },
  {
    path: "cuentas/:id",
    element: <CuentasForm/>
  },
  {
    path: "retiro/:id",
    element: <RetiroForm/>
  },
  {
    path: "billeteras/create",
    element: <BilleterasForm/>
  },
  {
    path: "transferir/:id",
    element: <TransferirForm/>
  },
  {
    path: "beneficiario/create",
    element: <BeneficiarioForm/>
  },
  {
    path: "beneficiario/:id",
    element: <BeneficiarioForm/>
  },
  {
    path: "beneficiarios",
    element: <BeneficiarioList />
  },
  {
    path: "ventas",
    element: <VentaList />
  },
  {
    path: "ventas/:id",
    element: <EditVentaForm />
  },
  {
    path: "comerciar/:id",
    element: <VentaForm />
  },
  {
    path: "comprar",
    element: <ComerciarList/>
  },
  {
    path: "comprar",
    element: <ComerciarList/>
  },
  {
    path: "comprar/:id",
    element: <ComerciarForm/>
  },
  {
    path: "validar/:id",
    element: <VerificacionForm />
  },
  {
    path: "movimientos/:id",
    element: <Movimientos />
  },
  {
    path: "monedas",
    element: <MonedaList />
  },
  {
    path: "monedas/:id",
    element: <MonedaForm />
  },
  {
    path: "monedas/create",
    element: <MonedaForm />
  },
  {
    path: "usuarios",
    element: <UsuariosList />
  },
  {
    path: "usuarios/:id",
    element: <UsuarioForm/>
  },
  {
    path: "billeteras/:id",
    element: <BilleterasUserList />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
