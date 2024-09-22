const express = require('express');
const router = express.Router();
const {
    crearEmpleado,
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    actualizarEmpleado,
    eliminarEmpleado
} = require('../controllers/empleado');

// Ruta para crear un nuevo empleado
router.post('/', crearEmpleado);

// Ruta para obtener todos los empleados
router.get('/', obtenerEmpleados);

// Ruta para obtener un empleado por ID
router.get('/:id', obtenerEmpleadoPorId);

// Ruta para actualizar un empleado por ID
router.put('/:id', actualizarEmpleado);

// Ruta para eliminar un empleado por ID
router.delete('/:id', eliminarEmpleado);

module.exports = router;
