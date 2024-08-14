// src/services/beneficiariosService.js
import axios from "axios";
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";

export const getBeneficiariosMine = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${import.meta.env.VITE_BASE_URL}beneficiarios/mine`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const getBeneficiarioById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'beneficiarios/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const updateBeneficiario = (id, beneficiario) => {
    return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_BASE_URL + 'beneficiarios/' + id, beneficiario, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                redirectOnError(error, reject);
            })
    });
}

export const updateBeneficiarioPatch = (id, beneficiario) => {
    return new Promise((resolve, reject) => {
        axios.patch(import.meta.env.VITE_BASE_URL + 'beneficiarios/' + id, beneficiario, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                redirectOnError(error, reject);
            })
    });
}


export const createBeneficiario = (beneficiario) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'beneficiarios', beneficiario, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const deleteBeneficiario = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(import.meta.env.VITE_BASE_URL + 'beneficiarios/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}