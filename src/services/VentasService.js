import axios from "axios";
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";

export const getVentasMine = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${import.meta.env.VITE_BASE_URL}ventas/mine`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const getVentasNoMine = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${import.meta.env.VITE_BASE_URL}ventas/nomine`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const getVentas = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${import.meta.env.VITE_BASE_URL}ventas`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const getVentasById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'ventas/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const updateVenta = (id, venta) => {
    return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_BASE_URL + 'ventas/' + id, venta, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                redirectOnError(error, reject);
            })
    });
}

export const updateVentaPatch = (id, venta) => {
    return new Promise((resolve, reject) => {
        axios.patch(import.meta.env.VITE_BASE_URL + 'ventas/' + id, venta, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                redirectOnError(error, reject);
            })
    });
}


export const createVenta = (venta) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'ventas', venta, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const deleteVenta = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${import.meta.env.VITE_BASE_URL}ventas/${id}`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};


// Función para subir la imagen de comprobante para una venta específica
export const uploadComprobante = (id, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
        axios.post(`${import.meta.env.VITE_BASE_URL}ventas/${id}/profile-picture`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                ...getCommonHeaders() // Asegúrate de incluir los headers comunes si es necesario
            },
        }).then((res) => {
            resolve(res.data);
        }).catch((error) => {
            redirectOnError(error, reject);
        });
    });
};