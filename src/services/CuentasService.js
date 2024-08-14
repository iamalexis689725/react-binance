import axios from "axios";
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";

export const getCuentasList = () => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'cuentas', getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getCuentaById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'cuentas/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getCuentasMine = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${import.meta.env.VITE_BASE_URL}cuentas/mine`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const insertCuenta = (cuenta) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'cuentas', cuenta, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const updateCuenta = (id, cuenta) => {
    return new Promise((resolve, reject) => {
        axios.put(`${import.meta.env.VITE_BASE_URL}cuentas/${id}`, cuenta, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const deleteCuenta = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${import.meta.env.VITE_BASE_URL}cuentas/${id}`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};