import axios from "axios";
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";


export const getMonedasList = () => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'monedas', getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const insertMoneda = (moneda) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'monedas', moneda, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getMonedaById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'monedas/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getMonedasMine = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${import.meta.env.VITE_BASE_URL}monedas/mine`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};


export const deleteMoneda = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${import.meta.env.VITE_BASE_URL}monedas/${id}`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const updateMoneda = (id, moneda) => {
    return new Promise((resolve, reject) => {
        axios.put(`${import.meta.env.VITE_BASE_URL}monedas/${id}`, moneda, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};