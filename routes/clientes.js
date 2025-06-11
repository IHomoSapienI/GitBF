const express = require('express');
const router = express.Router();
const {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente,
    cambiarEstadoCliente
} = require('../controllers/cliente');
const { validarJWT } = require('../middlewares/verificartoken'); // Asegúrate de que la ruta sea correcta
const verificarPermisos = require('../middlewares/verificarPermisos'); 
router.use(validarJWT);
// Ruta para crear un nuevo cliente
router.post('/', verificarPermisos(['crearCliente']), crearCliente);

// Ruta para obtener todos los clientes
router.get('/', verificarPermisos(['verCliente']),obtenerClientes);

// Ruta para obtener un cliente por ID
router.get('/:id', verificarPermisos(['verCliente']),obtenerClientePorId);

// Ruta para actualizar un cliente por ID
router.put('/:id', verificarPermisos(['actualizarCliente']),actualizarCliente);

// Ruta para eliminar un cliente por ID
router.delete('/:id',verificarPermisos(['eliminarCliente']), eliminarCliente);

// Ruta para cambiar el estado de un cliente
router.patch('/:id/toggle-estado', verificarPermisos(['cambiarEstadoCliente']),cambiarEstadoCliente);


module.exports = router;
