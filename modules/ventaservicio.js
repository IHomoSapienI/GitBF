const { Schema, model } = require('mongoose');

// Definición del esquema para ventas de servicios
const VentaServicioSchema = Schema({
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
    cita: { type: Schema.Types.ObjectId, ref: 'Cita' },
    servicios: [{
        servicio: { type: Schema.Types.ObjectId, ref: 'Servicio' },
        nombreServicio: { type: String, required: true },
        precio: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        tiempo: { type: Number, required: true } 
    }],
    precioTotal: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: Boolean,
        default: true
    },
    fecha: { // Nuevo campo para la fecha
        type: Date,
        default: Date.now // Establece la fecha actual por defecto
    }
});

module.exports = model('VentaServicio', VentaServicioSchema);
