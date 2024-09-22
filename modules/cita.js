const { Schema, model } = require('mongoose');

// Esquema para Cita
const CitaSchema = Schema({
    nombreempleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado', // Referencia al modelo Empleado
        required: true
    },
    nombrecliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente', // Referencia al modelo Cliente
        required: true
    },
    fechacita: {
        type: Date,
        required: true
    },
    montototal: {
        type: Number,
        required: true
    },
    estadocita: {
        type: String,
        enum: ['Pendiente', 'Confirmada', 'Cancelada'], // Enum para el estado de la cita
        default: 'Pendiente'
    }
});

module.exports = model('Cita', CitaSchema);
