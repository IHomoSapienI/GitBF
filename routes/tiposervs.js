const { Router} = require('express')

const router = Router()

const {tiposerviciosGet, tiposerviciosPost, tiposerviciosPut,tiposerviciosDelete} = require('../controllers/tiposerv');

router.get('/', tiposerviciosGet)
router.post('/', tiposerviciosPost)
router.put('/:id', tiposerviciosPut);
router.delete('/:id', tiposerviciosDelete);

module.exports = router