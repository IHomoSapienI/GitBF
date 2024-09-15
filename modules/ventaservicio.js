const { Schema, model } = require('mongoose');

// Definición del esquema para servicios
const VentaservicioSchema = Schema({
    cita: {
        type: String,
        required: true
    },
    detalle: {
        type: Schema.Types.ObjectId, ref: 'detalleservicio'
    },
    cliente: {
        type: String,
        required: true,
        
    },
    duracion: {
        type: Number,
        required: true,
        min: 0 // Asegura que el tiempo no sea negativo
    },
    precioTotal: [{ 
        type: Number,
        required: true,
        min: 0     }],

    estado: {
        type: Boolean,
        default: true // Por defecto el estado es activo
    }
});

module.exports = model('Ventaservicio', VentaservicioSchema);
