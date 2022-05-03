import ContenedorMongoDB from '../../contenedores/ContenedorMongoDB.js';
import { ProductoModel } from '../../contenedores/mongooseModels/ProductoModel.js'

class ProductosDaoMongoDB extends ContenedorMongoDB {

    constructor(isInitialized) {
        super(ProductoModel, isInitialized);
    }
}

export default ProductosDaoMongoDB;