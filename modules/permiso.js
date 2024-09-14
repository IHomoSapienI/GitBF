// models/Permiso.js
const { Schema, model } = require('mongoose');

const PermisoSchema = Schema({
    nombrePermiso: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },

    activo: { 
        type: Boolean, 
        default: true 
    },
});

module.exports = model('Permiso', PermisoSchema); // Modelo en minúsculas
