const { Schema, model } = require('mongoose');

const VentaservicioSchema = Schema({
    cita: {
        type: Schema.Types.ObjectId, // Cambiamos a ObjectId para referenciar el modelo Cita
        ref: 'Cita', // Referencia al modelo Cita
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        require: true
    },
    duracion: {
        type: Number,
        required: true
    },
    servicios: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Servicio' // Este es el campo que referencia el modelo Servicio
    }],
    precioTotal: {
        type: Number, // Precio total de la venta
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Ventaservicio', VentaservicioSchema);
