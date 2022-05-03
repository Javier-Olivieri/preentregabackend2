import ContenedorMongoDB from '../../contenedores/ContenedorMongoDB.js';
import { CarritoModel } from '../../contenedores/mongooseModels/CarritoModel.js'

class CarritosDaoMongoDB extends ContenedorMongoDB {

    constructor(isInitialized) {
        super(CarritoModel, isInitialized);
    }
}

export default CarritosDaoMongoDB;