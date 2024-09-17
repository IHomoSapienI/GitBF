const { Router} = require('express')

const router = Router()


const {usuariosGet, usuariosPost, usuariosPut, usuariosDelete, PromGet} = require('../controllers/usuario');

router.get('/', usuariosGet)

router.get('/promedio', PromGet)

router.post('/', usuariosPost)

router.put('/:id', usuariosPut)

router.delete('/:id', usuariosDelete)

module.exports = router