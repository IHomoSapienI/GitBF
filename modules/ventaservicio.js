const { Schema, model } = require('mongoose');

const VentaservicioSchema = Schema({
    cita: {
        type: Schema.Types.ObjectId,
        ref: 'Cita',
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    servicios: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Servicio', // Referencia al modelo 'Servicio'
            required: true
        }
    ],
    duracion: {
        type: Number,
        required: true
    },
    precioTotal: {
        type: Number,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Ventaservicio', VentaservicioSchema);
