const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({
    nombrecliente: {
        type: String,
        required: true
    },
    apellidocliente: {  // Nuevo campo agregado
        type: String,
        required: true
    },
    correocliente: {  // Nuevo campo agregado
        type: String,
        required: true,
        unique: true // Asegura que no haya duplicados de correo de cliente
    },
    celularcliente: {
        type: String,
        required: true,
        unique: true
    },
    estadocliente: {
        type: String,
        enum: ['Activo', 'Inactivo'], // Limita a estos dos valores
        default: 'Activo'
    }
});

module.exports = model('Cliente', ClienteSchema);