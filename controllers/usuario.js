const {response} = require('express')
const bcrypt = require('bcryptjs')

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

const usuariosPut = async(req, res = response) => {
    const body = req.query

    console.log(body)

  //  const usuario = new Usuario(body)

    const {nombre, email, password, rol, estado} = req.body

    const usuario = await Usuario.findOneAndUpdate({email: email}, {nombre: nombre, rol: rol});

    res.json({
        msg: 'Usuario Modificado',
        usuario
    });

}

const usuariosDelete = async(req, res = response) => {
    const body = req.query

    console.log(body)


    const {nombre, email, password, rol, estado} = req.query

    const usuario = await Usuario.findOneAndDelete({email: email})

    res.json({
        msg: 'Usuario Eliminado',
        usuario
    })

}

module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    PromGet
}