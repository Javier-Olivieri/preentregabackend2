import { Router } from 'express';
import dotenv from "dotenv";

const router = Router();
dotenv.config();

export let productDao;

if (process.env.PERSISTENCE === 'ARCHIVO') {
    const { default: ProductosDaoArchivo } = await import('../daos/productos/ProductosDaoArchivo.js')
    productDao = new ProductosDaoArchivo();
}
else if (process.env.PERSISTENCE === 'FIREBASE') {
    const { default: ProductosDaoFirebase } = await import('../daos/productos/ProductosDaoFirebase.js');
    productDao = new ProductosDaoFirebase(true);
}
else if (process.env.PERSISTENCE === 'MONGODB') {
    const { default: ProductosDaoMongoDB } = await import('../daos/productos/ProductosDaoMongoDB.js');
    productDao = new ProductosDaoMongoDB(true);
}
else if (process.env.PERSISTENCE === 'MEMORIA') {
    const { default: ProductosDaoMemoria } = await import('../daos/productos/ProductosDaoMemoria.js');
    productDao = new ProductosDaoMemoria();
}

router.get('/', async (req, res) => {
    try {
        const allProducts = await productDao.getAll()
        res.send({ productos: allProducts });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const productById = await productDao.getById(id);
        if (productById === null) {
            res.status(404).send({ error: -4, descripcion: 'Producto no encontrado.' });
            return;
        }
        res.send(productById);
    }
    catch (err) {
        res.status(400).send(err);
    }
});

function validateBodyAndAuthenticate(req, res, next) {
    const body = req.body;
    req.invalidBody = body.nombre == null || body.descripcion == null || body.codigo == null ||
        body.url == null || body.precio == null || body.stock == null;

    if (body.admin != null && body.admin != undefined)
        req.isAdmin = body.admin;

    next();
}

router.post('/', validateBodyAndAuthenticate, async (req, res) => {
    try {
        const product = req.body;
        let { invalidBody, isAdmin } = req;
        if (!isAdmin) {
            res.status(403).send({ error: -1, descripcion: 'Ruta: /api/productos método:POST no autorizada.' });
            return;
        }
        if (invalidBody) {
            res.status(400).send({ error: -3, descripcion: 'Producto a ingresar con formato inválido.' });
            return;
        }
        delete product.admin;
        const productToSave = { ...product, timestamp: Date.now() }
        const id = await productDao.save(productToSave);

        res.send({ idProductoGuardado: id });

    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.put('/:id', validateBodyAndAuthenticate, async (req, res) => {
    try {
        const product = req.body;
        const id = req.params.id;
        let { invalidBody, isAdmin } = req;
        if (!isAdmin) {
            res.status(403).send({ error: -1, descripcion: 'Ruta: /api/productos método:PUT no autorizada.' });
            return;
        }
        if (invalidBody) {
            res.status(400).send({ error: -3, descripcion: 'Producto a actualizar con formato inválido.' });
            return;
        }
        delete product.admin;
        const productToUpdate = { ...product, timestamp: Date.now() }
        const idUpdated = await productDao.updateById(id, productToUpdate);
        if (idUpdated !== null) {
            res.send({ idProductoActualizado: idUpdated })
            return;
        }
        res.status(404).send({ error: -4, descripcion: 'Producto no encontrado. No se pudo actualizar.' });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:id', validateBodyAndAuthenticate, async (req, res) => {
    try {
        const id = req.params.id;
        let { isAdmin } = req;
        if (!isAdmin) {
            res.status(403).send({ error: -1, descripcion: 'Ruta: /api/productos método:DELETE no autorizada.' });
            return;
        }
        const idDeleted = await productDao.deleteById(id);
        if (idDeleted === null) {
            res.status(404).send({ error: -4, descripcion: 'Producto no encontrado. No se pudo eliminar.' });
            return;
        }
        res.send({ idProductoEliminado: idDeleted });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

export default router;