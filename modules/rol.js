// models/Rol.js
const { Schema, model } = require('mongoose');

const RolSchema = Schema({
    nombreRol: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    permisoRol: [{ type: Schema.Types.ObjectId, ref: 'permiso' }], // Referencia a permisos

    estadoRol: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio'],
    },
});

module.exports = model('Rol', RolSchema);
