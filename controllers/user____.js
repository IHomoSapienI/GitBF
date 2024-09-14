const { response } = require('express')

usuariosGet = (req, res = response) => {
    res.json({
        msg: 'GET API'
    })
}

usuariosPost = (req, res = response) => {
    res.json({
        msg: 'POST API'
    })
}

usuariosPut= (req, res = response) => {
    res.json({
        msg: 'PUT API'
    })
}

usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'DELETE API'
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}