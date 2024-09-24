const { Schema, model } = require('mongoose');

const VentaProductoSchema = Schema({
    nombreProducto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto', // Se refiere al modelo de productos
        required: true
    },
    nombreCliente: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: false
    },
    precio: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('VentaProducto', VentaProductoSchema);
