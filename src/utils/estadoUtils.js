export const estado = (tipo) => {
    switch (tipo) {
        case 1:
            return 'Pendiente';
        case 2:
            return 'En validacion';
        case 3:
            return 'Vendida';
        default:
            return 'No definido';
    }
}