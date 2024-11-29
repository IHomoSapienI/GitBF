const { Router } = require('express');

const { validarJWT } = require('../middlewares/verificartoken'); // Asegúrate de que la ruta sea correcta
const verificarPermisos = require('../middlewares/verificarPermisos'); // Asegúrate de que la ruta sea correcta
const {permisosGet, permisosPost, permisosPut, permisosDelete} =require ('../controllers/permiso');
const router = Router();
router.use(validarJWT);

//router.get('/', verificarPermisos (['verPermisos']),permisosGet);
//router.post('/', verificarPermisos (['crearPermiso']),permisosPost);
router.get('/', permisosGet);
router.post('/', permisosPost);
router.put('/:id', permisosPut);
router.delete('/:id', permisosDelete);
module.exports = router;