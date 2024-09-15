const { Schema, model } = require('mongoose');

// Definición del esquema para servicios
const ServicioSchema = Schema({
    nombreServicio: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: false // Opcional, puedes ajustarlo según tus necesidades
    },
    precio: {
        type: Number,
        required: true,
        min: 0 // Asegura que el precio no sea negativo
    },
    tiempo: {
        type: Number,
        required: true,
        min: 0 // Asegura que el tiempo no sea negativo
    },
    tipoServicio: [{ 
        type: Schema.Types.ObjectId, ref: 'tiposerv'
     }],

    estado: {
        type: Boolean,
        default: true // Por defecto el estado es activo
    }
});

module.exports = model('Servicio', ServicioSchema);
