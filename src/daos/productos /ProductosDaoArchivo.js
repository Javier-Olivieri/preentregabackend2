import ContenedorArchivo from '../../contenedores/ContenedorArchivo.js';

class ProductosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('src/contenedores/files/productos.txt');
    }
}

export default ProductosDaoArchivo;