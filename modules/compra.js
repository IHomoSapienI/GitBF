const { Schema, model } = require('mongoose');

// Definición del esquema para compras
const CompraSchema = Schema({
    proveedor: {
        type: String,
        required: true
    },
    recibo: {
        type: String,
        required: true
    },
    fechaCompra: {
        type: Date,
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    monto: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Compra', CompraSchema);
