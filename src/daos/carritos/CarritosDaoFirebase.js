import ContenedorFirebase from '../../contenedores/ContenedorFirebase.js';

class CarritosDaoFirebase extends ContenedorFirebase {

    constructor(isInitialized) {
        super('carritos', isInitialized);
    }
}

export default CarritosDaoFirebase;