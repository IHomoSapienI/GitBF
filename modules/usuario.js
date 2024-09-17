const {Schema, model} = require('mongoose')
 
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    email: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    password: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: 3,
        maxlength:[60, 'El password debe ser de máximo 7 y se obtuvo: {VALUE}'],
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

})

module.exports = model('Usuario', UsuarioSchema);