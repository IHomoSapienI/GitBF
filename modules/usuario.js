const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs'); // Importar bcrypt para encriptar la contraseña

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    email: {
        type: String,
        required: [true, 'El email es obligatorio'], // Cambiar mensaje de error para el email
        unique: true, // Asegurar que el email sea único
        match: [/^\S+@\S+\.\S+$/, 'Por favor, ingrese un email válido'] // Validación de formato de email
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'], // Cambiar mensaje de error para el password
        minlength: [7, 'La contraseña debe tener al menos 7 caracteres'], // Cambiar el mínimo de 3 a 7
        maxlength: [60, 'La contraseña no puede superar los 60 caracteres'],
    },

    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Rol',
    },

    estado: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
});


module.exports = model('Usuario', UsuarioSchema);
