const bcrypt = require('bcryptjs');
const User = require('../modules/usuario');
const Rol = require('../modules/rol');

const createUser = async ({ nombre, email, password, rol, estado }) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Contraseña encriptada antes de guardar:', hashedPassword);

        // Fetch the complete role object
        const roleObject = await Rol.findById(rol);
        if (!roleObject) {
            throw new Error('Rol no encontrado');
        }

        const newUser = new User({
            nombre,
            email,
            password: hashedPassword,
            rol: roleObject._id,
            estado
        });

        await newUser.save();
        
        // Populate the rol field after saving
        await newUser.populate('rol');

        console.log('Usuario creado exitosamente:', JSON.stringify(newUser, null, 2));

        return newUser;
    } catch (error) {
        throw new Error('Error al crear el usuario: ' + error.message);
    }
};

module.exports = { createUser };