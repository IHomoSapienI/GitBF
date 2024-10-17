const express = require('express');
const router = express.Router();
const {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/cliente');
const { validarJWT } = require('../middlewares/verificartoken'); // Asegúrate de que la ruta sea correcta
const verificarPermisos = require('../middlewares/verificarPermisos'); 
router.use(validarJWT);
// Ruta para crear un nuevo cliente
router.post('/', verificarPermisos(['verCliente']), crearCliente);

// Ruta para obtener todos los clientes
router.get('/', verificarPermisos(['crearCliente']),obtenerClientes);

// Ruta para obtener un cliente por ID
router.get('/:id', verificarPermisos(['verCliente']),obtenerClientePorId);

// Ruta para actualizar un cliente por ID
router.put('/:id', verificarPermisos(['actualizarCompras']),actualizarCliente);

// Ruta para eliminar un cliente por ID
router.delete('/:id',verificarPermisos(['eliminarCompras']), eliminarCliente);

module.exports = router;
