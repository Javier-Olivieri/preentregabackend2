import mongoose from "mongoose";

const productosCollection = "productos";

const productosSchema = new mongoose.Schema({
    codigo: { type: String, required: true, max: 100 },
    descripcion: { type: String, required: true, max: 100 },
    nombre: { type: String, required: true, max: 100 },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    url: { type: String, required: true, max: 200 },
});

export const ProductoModel = mongoose.model(productosCollection, productosSchema);