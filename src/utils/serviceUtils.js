import { v4 as uuidv4 } from 'uuid';

export const redirectOnError = (error, reject) => {
    console.log(error);
    if (error.response.status === 401) {
        window.location.href = '/login';
        localStorage.removeItem('token')
        return;
    }
    reject(error);
}
export const getCommonHeaders = () => {
    return {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
}


export const generateUuid = () => {
    const newUuid = uuidv4();
    return newUuid;
}