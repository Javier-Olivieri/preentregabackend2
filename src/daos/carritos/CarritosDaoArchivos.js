import ContenedorArchivo from '../../contenedores/ContenedorArchivo.js';

class CarritosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('src/contenedores/files/carrito.txt');
    }
}

export default CarritosDaoArchivo;