import { Router } from 'express';
import dotenv from 'dotenv';

const router = Router();
dotenv.config();

let cartDao;
const { productDao } = await import('./product.js');

if (process.env.PERSISTENCE === 'ARCHIVO') {
    const { default: CarritosDaoArchivo } = await import('../daos/carritos/CarritosDaoArchivos.js');
    cartDao = new CarritosDaoArchivo();
}
else if (process.env.PERSISTENCE === 'FIREBASE') {
    const { default: CarritosDaoFirebase } = await import('../daos/carritos/CarritosDaoFirebase.js');
    cartDao = new CarritosDaoFirebase(false);
}
else if (process.env.PERSISTENCE === 'MONGODB') {
    const { default: CarritosDaoMongoDB } = await import('../daos/carritos/CarritosDaoMongoDB.js');
    cartDao = new CarritosDaoMongoDB(false);
}
else if (process.env.PERSISTENCE === 'MEMORIA') {
    const { default: CarritosDaoMemoria } = await import('../daos/carritos/CarritosDaoMemoria.js');
    cartDao = new CarritosDaoMemoria();
}

router.post('/', async (req, res) => {
    try {
        const cartToSave = { timestamp: Date.now(), productos: [] }
        const id = await cartDao.save(cartToSave);

        res.send({ idCarritoGuardado: id });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const idDeleted = await cartDao.deleteById(id);
        if (idDeleted === null) {
            res.status(404).send({ error: -4, descripcion: 'Carrito no encontrado. No se pudo eliminar.' });
            return;
        }
        res.send({ idCarritoEliminado: idDeleted })
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.post('/:id/productos/:id_prod', async (req, res) => {
    try {
        const cartId = req.params.id;
        const productId = req.params.id_prod;

        const productById = await productDao.getById(productId);
        if (productById === null) {
            res.status(404).send({ error: -4, descripcion: 'No se pudo agregar al carrito. Producto no encontrado.' });
            return;
        }

        const cartById = await cartDao.getById(cartId);
        if (cartById === null) {
            res.status(404).send({ error: -4, descripcion: 'No se pudo agregar al carrito. Carrito no encontrado.' });
            return;
        }
        cartById.productos.push(productById);

        const idUpdated = await cartDao.updateById(cartId, cartById);
        if (idUpdated == null) {
            res.status(400).send({ error: -5, descripcion: 'No se pudo agregar al carrito. Hubo un problema al actualizar el carrito.' });
            return;
        }
        res.send({ idCarritoActualizado: idUpdated });
    }
    catch (err) {
        res.status(400).send(err);
    }
});


router.get('/:id/productos', async (req, res) => {
    try {
        const cartId = req.params.id;
        const cartById = await cartDao.getById(cartId);
        if (cartById === null) {
            res.status(404).send({ error: -4, descripcion: 'No se pudieron obtener los productos. Carrito no encontrado.' });
            return;
        }
        res.send({ productos: cartById.productos });
    }
    catch (err) {
        res.status(400).send(err);
    }
});


router.delete('/:id/productos/:id_prod', async (req, res) => {
    try {
        const cartId = req.params.id;
        const productId = req.params.id_prod;

        const cartById = await cartDao.getById(cartId);
        if (cartById === null) {
            res.status(404).send({ error: -4, descripcion: 'No se pudo eliminar del carrito. Carrito no encontrado.' });
            return;
        }

        let filtered
        if (process.env.PERSISTENCE === 'MONGODB')
            filtered = cartById.productos.filter(p => p._id.toString() == productId);
        else
            filtered = cartById.productos.filter(p => p.id == productId);

        if (filtered.length === 0) {
            res.status(404).send({ error: -4, descripcion: 'No se pudo eliminar del carrito. Producto no encontrado.' });
            return;
        }

        if (process.env.PERSISTENCE === 'MONGODB')
            cartById.productos = cartById.productos.filter(p => p._id.toString() != productId);
        else
            cartById.productos = cartById.productos.filter(p => p.id != productId);

        const idUpdated = await cartDao.updateById(cartId, cartById);
        if (idUpdated == null) {
            res.status(400).send({ error: -5, descripcion: 'No se pudo eliminar del carrito. Hubo un problema al actualizar el carrito.' });
            return;
        }
        res.send({ idCarritoActualizado: idUpdated });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

export default router;