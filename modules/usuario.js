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
        ref: 'rol',
    },

    estado: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
});

// Middleware para encriptar la contraseña antes de guardar el usuario
UsuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); // Encriptar la contraseña
        next();
    } catch (err) {
        next(err);
    }
});

// Método para comparar contraseñas
UsuarioSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = model('Usuario', UsuarioSchema);
