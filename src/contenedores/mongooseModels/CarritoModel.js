import mongoose from "mongoose";

const carritosCollection = "carritos";

const carritosSchema = new mongoose.Schema({
    productos: { type: Array, required: true },
    timestamp: { type: Number, required: true }
});

export const CarritoModel = mongoose.model(carritosCollection, carritosSchema);