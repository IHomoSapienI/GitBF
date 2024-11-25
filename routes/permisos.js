const { Router } = require('express');
const router = Router();
const {permisosGet, permisosPost, permisosPut, permisosDelete} =require ('../controllers/permiso');

router.get('/', verificarPermisos (['verPermisos']),permisosGet);
router.post('/', verificarPermisos (['crearPermiso']),permisosPost);
router.put('/:id', permisosPut);
router.delete('/:id', permisosDelete);
module.exports = router;