import ContenedorFirebase from '../../contenedores/ContenedorFirebase.js';

class ProductosDaoFirebase extends ContenedorFirebase {

    constructor(isInitialized) {
        super('productos', isInitialized);
    }
}

export default ProductosDaoFirebase;