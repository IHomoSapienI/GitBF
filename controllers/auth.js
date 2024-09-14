const Usuario = require('../modules/usuario')
const bcrypt = require('bcryptjs')

async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}

const login = async(req, res) => {
    const { email, password } = req.body 
    
    //Verificar si el email existe
    const usuarios = await Usuario.findOne({email})

    try {

        //Verificar si el email existe
        //const usuarios = await Usuario.findOne({correo})
        if( !usuarios ){
            return res.status(400).json({
                msg: 'Correo electrónico no encontrado'
            })
        }

        if( !usuarios.estado ){
            return res.status(400).json({
                msg: 'Usuario inactivo'
            })            
        }

        resultado = await comparePassword(password, usuarios.password)

        if(resultado ==true){
            return res.status(400).json({
                msg: 'El password es correcto'
            }) 
        }
        else{
            return res.status(400).json({
                msg: 'El password es incorrecto'
            }) 
        }
     } catch (err) {
    return res.status(400).json({
        msg: 'Apreciado usuario contacte al administrador.'
    })
}

}


module.exports = {
    login
}