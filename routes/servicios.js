const { Router } = require('express');
const router = Router();
const {serviciosGet,serviciosPost, serviciosPut, serviciosDelete} =require ('../controllers/servicio');

router.get('/', serviciosGet);
router.post('/', serviciosPost);
router.put('/:id', serviciosPut);  // Actualizar un servicio
router.delete('/:id', serviciosDelete);


module.exports = router;