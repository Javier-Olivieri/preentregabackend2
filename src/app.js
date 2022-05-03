import express from 'express';
import { json } from 'express';
import product from './router/product.js';
import carrito from './router/carrito.js';

const server = express();

server.use(json());
server.use(express.urlencoded({ extended: true }));

server.use('/api/productos', product);
server.use('/api/carrito', carrito);

server.get('*', (req, res) => {
    res.status(404).send({ error: -2, descripcion: `ruta:${req.path} método:GET no implementada` });
});
server.post('*', (req, res) => {
    res.status(404).send({ error: -2, descripcion: `ruta:${req.path} método:POST no implementada` });
});
server.put('*', (req, res) => {
    res.status(404).send({ error: -2, descripcion: `ruta:${req.path} método:PUT no implementada` });
});
server.delete('*', (req, res) => {
    res.status(404).send({ error: -2, descripcion: `ruta:${req.path} método:DELETE no implementada` });
});

export default server;