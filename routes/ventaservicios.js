const { Router} = require('express')

const router = Router()

const {ventaserviciosGet, ventaserviciosPost, ventaserviciosPut, ventaserviciosDelete} = require('../controllers/ventaservicio');

router.get('/', ventaserviciosGet)

router.post('/', ventaserviciosPost)

router.put('/:id', ventaserviciosPut)

router.delete('/:id', ventaserviciosDelete)

module.exports = router