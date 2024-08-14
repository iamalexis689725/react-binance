export const getTasaConversionRetiroBC = (tipo) => {
    switch (tipo) {
        case "BS":
            return '423472.38';
        case "USD":
            return '61452.10';
        default:
            return 'No definido';
    }
}

export const getTasaConversionRetiroETH = (tipo) => {
    switch (tipo) {
        case "BS":
            return '23321.75';
        case "USD":
            return '3384.33';
        default:
            return 'No definido';
    }
}

export const getTasaConversionRetiroBNB = (tipo) => {
    switch (tipo) {
        case "BS":
            return '3973.68';
        case "USD":
            return '574.48';
        default:
            return 'No definido';
    }
}

export const getTasaConversionRetiroDOGE = (tipo) => {
    switch (tipo) {
        case "BS":
            return '0.85';
        case "USD":
            return '0.12';
        default:
            return 'No definido';
    }
}


export const valorMonedaRetiro = (nombreMoneda, monedaCuenta) => {
    if (nombreMoneda==="bitcoin"){
        return getTasaConversionRetiroBC(monedaCuenta)
    }
    if (nombreMoneda==="ethereum"){
        return getTasaConversionRetiroETH(monedaCuenta)
    }
    if (nombreMoneda==="bnb"){
        return getTasaConversionRetiroBNB(monedaCuenta)
    }
    if (nombreMoneda==="dogecoin") {
        return getTasaConversionRetiroDOGE(monedaCuenta)
    }
}