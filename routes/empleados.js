const { Router } = require('express');
const { crearEmpleado, obtenerEmpleados, obtenerEmpleadoPorId, actualizarEmpleado, eliminarEmpleado } = require('../controllers/empleado');
const { validarJWT } = require('../middlewares/verificartoken'); // Asegúrate de que la ruta sea correcta
const verificarPermisos = require('../middlewares/verificarPermisos'); 
router.use(validarJWT);

const router = Router();
// Ruta para crear un nuevo empleado
router.post('/', verificarPermisos (['crearEmpleado']),crearEmpleado);

// Ruta para obtener todos los empleados
router.get('/', verificarPermisos (['verEmpleado']), obtenerEmpleados);

// Ruta para obtener un empleado por ID
router.get('/:id', verificarPermisos (['verEmpleado']), obtenerEmpleadoPorId);

// Ruta para actualizar un empleado por ID
router.put('/:id', verificarPermisos (['actualizarEmpleado']),actualizarEmpleado);

// Ruta para eliminar un empleado por ID
router.delete('/:id', verificarPermisos (['eliminarEmpleado']),eliminarEmpleado);

module.exports = router;
