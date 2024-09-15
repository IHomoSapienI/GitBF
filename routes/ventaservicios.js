const { Router} = require('express')

const router = Router()

const {ventaserviciosGet, ventaserviciosPost} = require('../controllers/ventaservicio');

router.get('/', ventaserviciosGet)

router.post('/', ventaserviciosPost)

module.exports = router