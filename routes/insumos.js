const { Router } = require('express');

const { obtenerInsumos, crearInsumo, actualizarInsumo, eliminarInsumo, cambiarEstadoInsumo } = require('../controllers/insumo');
const { validarJWT } = require('../middlewares/verificartoken'); // Asegúrate de que la ruta sea correcta
const verificarPermisos = require('../middlewares/verificarPermisos'); // Asegúrate de que la ruta sea correcta
const router = Router();
router.use(validarJWT);
// Obtener todos los insumos
router.get('/', verificarPermisos (['verInsumo']), obtenerInsumos);

// Crear un nuevo insumo
router.post('/', verificarPermisos (['crearInsumo']),crearInsumo);

// Actualizar un insumo por ID
router.put('/:id', verificarPermisos (['actualizarInsumo']), actualizarInsumo);

// Eliminar un insumo por ID
router.delete('/:id', verificarPermisos (['eliminarInsumo']),eliminarInsumo);

// Cambiar el estado de un insumo por ID
router.patch('/:id/estado', cambiarEstadoInsumo);

module.exports = router;
