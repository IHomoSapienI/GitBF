const { Router } = require('express');
const router = Router();
const {serviciosGet, servicioDetalleGet, serviciosPost,} =require ('../controllers/servicio');

router.get('/', serviciosGet);
router.get('/servicios/:id', servicioDetalleGet);
router.post('/', serviciosPost);



module.exports = router;