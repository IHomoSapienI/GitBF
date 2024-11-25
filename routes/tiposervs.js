const { Router} = require('express')

const router = Router()

const {tiposerviciosGet, tiposerviciosPost, tiposerviciosPut} = require('../controllers/tiposerv');

router.get('/', tiposerviciosGet)
router.post('/', tiposerviciosPost)
router.put('/:id', tiposerviciosPut);
module.exports = router