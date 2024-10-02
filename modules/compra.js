const { Schema, model } = require('mongoose');

// Definición del esquema para compras
const CompraSchema = Schema({
    proveedor: {
        type: Schema.Types.ObjectId, // Referencia a proveedores
        ref: 'Proveedor', // El nombre del modelo de proveedores (asegúrate que sea correcto)
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
