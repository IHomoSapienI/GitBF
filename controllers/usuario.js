const { response } = require('express');
const Rol = require('../modules/rol'); // Asegúrate de tener el modelo de Rol
const Usuario = require('../modules/usuario'); // Asegúrate de tener el modelo de Usuario
const { createUser } = require('../controllers/userHelper');
 
const usuariosGet = async (req, res = response) => {
    try {
        // Consultar todos los documentos de la colección, omitiendo las contraseñas
        const usuarios = await Usuario.find().select('-password'); // Eliminar el campo `password` de la respuesta

        res.json({
            usuarios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener usuarios',
            error
        });
    }
};

const PromGet = async (req, res = response) => {
    const { q, nombre, page = 1, limit } = req.query;

    try {
        const usuarios = await Usuario.find(); // Consultar todos los documentos de una colección

        // Log para verificar los usuarios
        usuarios.forEach(usuario => console.log(usuario));

        res.json({
            msg: 'Prom API controlador',
            q,
            nombre,
            page,
            limit,
            usuarios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener usuarios',
            error
        });
    }
};

const usuariosPost = async (req, res = response) => {
    const { nombre, email, password, rol, estado, confirmPassword } = req.body;

    try {
        // Validar campos obligatorios
        if (!nombre || !email || !password || !confirmPassword) {
            return res.status(400).json({
                msg: 'Faltan campos obligatorios (nombre, email, password, confirmPassword)'
            });
        }

        // Verificar que la contraseña y la confirmación coincidan
        if (password !== confirmPassword) {
            return res.status(400).json({
                msg: 'Las contraseñas no coinciden'
            });
        }

        // Verificar si el rol existe
        if (rol) {
            const existeRol = await Rol.findById(rol);
            if (!existeRol) {
                return res.status(400).json({
                    msg: 'El rol especificado no es válido'
                });
            }
        } else {
            // Asignar un rol por defecto si no se especifica
            const rolPredeterminado = await Rol.findOne({ nombreRol: 'Cliente' }); // Cambia 'Cliente' al nombre que desees
            if (!rolPredeterminado) {
                return res.status(400).json({ msg: 'El rol predeterminado no existe.' });
            }
            rol = rolPredeterminado._id; // Asigna el ID del rol por defecto
        }

        // Llamar a la función createUser para crear y guardar el usuario
        const usuario = await createUser({ nombre, email, password, rol, estado });

        // Eliminar el campo de la contraseña de la respuesta
        const { password: _, ...usuarioResponse } = usuario.toObject(); // Excluye 'password'

        res.status(201).json({
            msg: 'Usuario registrado',
            usuario: usuarioResponse // Retorna el usuario sin la contraseña
        });
    } catch (error) {
        console.error(error);
        let msg = 'Error al registrar usuario';
        if (error.name === 'ValidationError') {
            msg = Object.values(error.errors).map(val => val.message);
        }
        res.status(500).json({
            msg
        });
    }
};
// Actualizar un usuario existente
const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { email, nombre, rol } = req.body;

    try {
        // Verificar si el rol existe
        const existeRol = await Rol.findById(rol);
        if (!existeRol) {
            return res.status(400).json({
                msg: 'El rol especificado no es válido'
            });
        }

        // Actualizar el usuario
        const usuario = await Usuario.findByIdAndUpdate(id, { nombre, rol }, { new: true }).select('-password');

        res.json({
            msg: 'Usuario modificado correctamente',
            usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al modificar usuario',
            error
        });
    }
};

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params; // Obtener el ID del parámetro de la ruta

    try {
        if (!id) {
            return res.status(400).json({
                msg: 'El ID es necesario para eliminar el usuario'
            });
        }

        const usuario = await Usuario.findByIdAndDelete(id);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        res.json({
            msg: 'Usuario eliminado',
            usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al eliminar usuario',
            error
        });
    }
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    PromGet
};
