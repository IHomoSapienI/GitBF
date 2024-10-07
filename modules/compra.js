const { Schema, model } = require('mongoose');

// Definición del esquema para compras
const CompraSchema = Schema({
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
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
        required: true
      },
    estado: {
        type: Boolean,
        default: true
    },
    // Nuevo campo para los insumos comprados
    insumos: [{
        insumo: {
            type: Schema.Types.ObjectId,
            ref: 'Insumo',
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        }
    }]
});

// Middleware para calcular el monto total antes de guardar
CompraSchema.pre('save', function(next) {
    this.monto = this.insumos.reduce((total, item) => {
        return total + (item.cantidad * (item.insumo.precio || 0)); // Asegúrate de que 'insumo' tenga el precio disponible en su esquema
    }, 0);
    next();
});

module.exports = model('Compra', CompraSchema);
