const { Router} = require('express')

const router = Router()

const {usuariosGet, usuariosPost, usuariosPut, usuariosDelete, PromGet} = require('../controllers/usuario');

router.get('/', usuariosGet)

router.get('/promedio', PromGet)

router.post('/', usuariosPost)

router.put('/', usuariosPut)

router.delete('/api/usuarios/:id', usuariosDelete)

module.exports = router