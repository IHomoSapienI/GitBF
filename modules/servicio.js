const { Schema, model } = require('mongoose');

// Definición del esquema para servicios
const ServicioSchema = Schema({
    nombreServicio: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: false 
    },
    precio: {
        type: Number,
        required: true,
        min: 0 
    },
    tiempo: {
        type: Number,
        required: true,
        min: 0 
    },
    tipoServicio: { 
        type: Schema.Types.ObjectId, ref: 'TipoServ'
    },
    estado: {
        type: Boolean,
        default: true 
    }
});

module.exports = model('Servicio', ServicioSchema);
