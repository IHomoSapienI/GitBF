const { Router } = require('express');
const router = Router();
const {permisosGet} =require ('../controllers/permiso');

router.get('/', permisosGet);

module.exports = router;