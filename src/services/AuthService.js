import axios from "axios";

export const postLogin = (credentials) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'auth/login', credentials)
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                reject(error);
            });
    });
}
export const postRegister = (credentials) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'users', credentials)
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                reject(error);
            });
    });
}

export const getAdminById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${import.meta.env.VITE_BASE_URL}users/${id}`)
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                reject(error);
            });
    });
}

export const getCurrentUser = () => {
    const token = localStorage.getItem('token'); // Obtener el token de localStorage
    if (!token) {
        return Promise.reject("No hay token disponible"); // Manejar caso sin token
    }
    return axios.get(`${import.meta.env.VITE_BASE_URL}auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
        },
    }).then((res) => {
        return res.data; // Devolver los datos del usuario
    }).catch((error) => {
        return Promise.reject(error); // Manejar errores
    });
};
