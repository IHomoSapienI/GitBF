const { Schema, model } = require('mongoose');

// Definición del esquema para la baja de productos
const BajaProductoSchema = Schema({
    producto: {
        type: String,
        required: true
    },
    fechaBaja: {
        type: Date,
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    observaciones: {
        type: String,
        default: ''
    }
});

module.exports = model('BajaProducto', BajaProductoSchema);
