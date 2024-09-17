const { Schema, model } = require('mongoose');

const VentaservicioSchema = Schema({
    cita: {
        type: String,
        required: true
    },
    detalle: {
        type: Schema.Types.ObjectId,
        ref: 'detalleservicio', // Referencia al modelo Detalleservicio
        required: true
    },
    cliente: {
        type: String,
        required: true
    },
    duracion: {
        type: Number,
        required: true
    },
    precioTotal: {
        type: [Number], // Array de precios
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Ventaservicio', VentaservicioSchema);
