const {response} = require('express')
const bcrypt = require('bcryptjs')
const Rol = require('../modules/rol');
//Importar modelos
const Usuario = require('../modules/usuario')

const usuariosGet = async (req, res = response) => {
    const body = req.query

    const {q, nombre, page= 1, limit} = req.query;

    const usuarios = await Usuario.find(); //Consultar todos los documentos de una colección

    res.json({
        usuarios
    });
}

const PromGet = async (req, res = response) => {
    const body = req.query;

    const {q, nombre, page= 1, limit} = req.query;

    const usuarios = await Usuario.find(); //Consultar todos los documentos de una colección

    usuarios.forEach(numero => console.log(numero));

    res.json({
        msg: 'Prom API controlador',
        q,
        nombre,
        page,
        limit,
        usuarios
    })
}

const usuariosPost = async(req, res = response) => {
    const body = req.body;

    //console.log(body)
    let msg = ''

    const usuario = new Usuario(body)

    const {nombre, email, password, rol, estado} = req.body;
    
    try {
        const existeRol = await Rol.findById(rol);
        if (!existeRol) {
            return res.status(400).json({
                msg: 'El rol especificado no es válido'
            });
        }
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10); //vueltas a encriptar
        usuario.password = bcrypt.hashSync( password, salt );
        
        await usuario.save()
        msg = 'Usuario Registrado'
    } catch (error) {
        console.log(error)
        //msg += error.errors.password.message
        //msg = error
        if (error) {
            if (error.name === 'ValidationError') {
                console.error(Object.values(error.errors).map(val => val.message))
                msg = Object.values(error.errors).map(val => val.message);
            }
        }
        
    }
   
    console.log(msg);
    res.json({
        msg: msg
    });

    
}

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

        // Actualizar el usuario por su email
        const usuario = await Usuario.findByIdAndUpdate(id, { nombre, rol }, { new: true });

        res.json({
            msg: 'Usuario Modificado correctamente',
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
            msg: 'Usuario Eliminado',
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




module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    PromGet
}