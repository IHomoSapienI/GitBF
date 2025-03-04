const { response } = require('express');
const Rol = require('../modules/rol');
const Usuario = require('../modules/usuario');
const Cliente = require('../modules/cliente'); // Importar el modelo de Cliente
const Empleado = require('../modules/empleado'); // Importar el modelo de Empleado
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios (sin mostrar contraseñas)
const usuariosGet = async (req, res = response) => {
    try {
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

const usuariosPost = async (req, res = response) => {
    const { nombre, apellido, email, celular, password, confirmPassword } = req.body;

    try {
        // Validar campos obligatorios
        if (!nombre || !apellido || !email || !celular || !password || !confirmPassword) {
            return res.status(400).json({
                msg: 'Faltan campos obligatorios (nombre, apellido, email, celular, password, confirmPassword)'
            });
        }

        // Verificar que la contraseña y la confirmación coincidan
        if (password !== confirmPassword) {
            return res.status(400).json({
                msg: 'Las contraseñas no coinciden'
            });
        }

        // Verificar si el usuario ya existe
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                msg: 'El correo ya está en uso'
            });
        }

        // Verificar si el celular ya existe
        const existeCelular = await Usuario.findOne({ celular });
        if (existeCelular) {
            return res.status(400).json({
                msg: 'El celular ya está en uso'
            });
        }

        // Verificar cuántos usuarios existen para asignar rol
        const usuarios = await Usuario.countDocuments();
        let rol;

        if (usuarios === 0) {
            // Asignar rol de Admin si es el primer usuario
            rol = await Rol.findOne({ nombreRol: 'Admin' });
        } else {
            // Asignar rol de usuario por defecto (Cliente)
            rol = await Rol.findOne({ nombreRol: 'Cliente' });
        }

        // Verificar si el rol fue encontrado
        if (!rol) {
            return res.status(400).json({ msg: 'El rol por defecto no existe.' });
        }

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        const passwordEncriptada = bcrypt.hashSync(password, salt);

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email,
            celular,
            password: passwordEncriptada,
            rol: rol._id,
            estado: true
        });

        // Guardar usuario en la base de datos
        await nuevoUsuario.save();

        // Eliminar el campo de la contraseña de la respuesta
        const { password: _, ...usuarioResponse } = nuevoUsuario.toObject(); // Excluye 'password'

        // Verificar el rol y crear el cliente o empleado correspondiente
        if (rol.nombreRol === 'Cliente') {
            // Crear un nuevo cliente
            const nuevoCliente = new Cliente({
                nombrecliente: nombre,
                apellidocliente: apellido,
                correocliente: email,
                celularcliente: celular,
                estadocliente: true
            });

            await nuevoCliente.save();
        } else if (rol.nombreRol === 'Empleado') {
            // Crear un nuevo empleado
            const nuevoEmpleado = new Empleado({
                nombreempleado: nombre,
                apellidoempleado: apellido,
                correoempleado: email,
                telefonoempleado: celular,
                estadoempleado: true
            });

            await nuevoEmpleado.save();
        }

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
    const { email, nombre, apellido, celular, rol } = req.body;

    try {
        // Verificar si el rol existe
        const existeRol = await Rol.findById(rol);
        if (rol && !existeRol) {
            return res.status(400).json({
                msg: 'El rol especificado no es válido'
            });
        }

        // Obtener el usuario actual antes de actualizarlo
        const usuarioActual = await Usuario.findById(id);
        if (!usuarioActual) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        // Verificar si el rol del usuario está cambiando
        const rolCambiado = usuarioActual.rol.toString() !== rol;

        // Actualizar el usuario
        const usuario = await Usuario.findByIdAndUpdate(
            id,
            { nombre, apellido, celular, rol },
            { new: true }
        ).select('-password');

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        // Si el rol cambió, manejar la creación o eliminación en las tablas de Cliente o Empleado
        if (rolCambiado) {
            const rolNuevo = await Rol.findById(rol);

            // Si el nuevo rol es "Cliente"
            if (rolNuevo.nombreRol === 'Cliente') {
                // Verificar si ya existe un cliente con este correo
                const clienteExistente = await Cliente.findOne({ correocliente: usuario.email });

                if (!clienteExistente) {
                    // Crear un nuevo cliente
                    const nuevoCliente = new Cliente({
                        nombrecliente: usuario.nombre,
                        apellidocliente: usuario.apellido,
                        correocliente: usuario.email,
                        celularcliente: usuario.celular,
                        estadocliente: true
                    });

                    await nuevoCliente.save();
                }

                // Si el usuario tenía un rol de "Empleado", eliminar el registro de empleado
                if (usuarioActual.rol.nombreRol === 'Empleado') {
                    await Empleado.findOneAndDelete({ correoempleado: usuario.email });
                }
            }

            // Si el nuevo rol es "Empleado"
            else if (rolNuevo.nombreRol === 'Empleado') {
                // Verificar si ya existe un empleado con este correo
                const empleadoExistente = await Empleado.findOne({ correoempleado: usuario.email });

                if (!empleadoExistente) {
                    // Crear un nuevo empleado
                    const nuevoEmpleado = new Empleado({
                        nombreempleado: usuario.nombre,
                        apellidoempleado: usuario.apellido,
                        correoempleado: usuario.email,
                        telefonoempleado: usuario.celular,
                        estadoempleado: true
                    });

                    await nuevoEmpleado.save();
                }

                // Si el usuario tenía un rol de "Cliente", eliminar el registro de cliente
                if (usuarioActual.rol.nombreRol === 'Cliente') {
                    await Cliente.findOneAndDelete({ correocliente: usuario.email });
                }
            }

            // Si el nuevo rol no es ni "Cliente" ni "Empleado", eliminar registros de cliente o empleado
            else {
                await Cliente.findOneAndDelete({ correocliente: usuario.email });
                await Empleado.findOneAndDelete({ correoempleado: usuario.email });
            }
        }

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

// Eliminar un usuario
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

// Consultar usuarios con parámetros (PromGet)
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

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    PromGet
};
