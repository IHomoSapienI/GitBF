const { Router } = require('express');
const router = Router();
const {permisosGet, permisosPost} =require ('../controllers/permiso');

router.get('/', permisosGet);
router.post('/', permisosPost);
module.exports = router;