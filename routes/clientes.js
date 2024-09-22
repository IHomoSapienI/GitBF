const express = require('express');
const router = express.Router();
const {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/cliente');

// Ruta para crear un nuevo cliente
router.post('/', crearCliente);

// Ruta para obtener todos los clientes
router.get('/', obtenerClientes);

// Ruta para obtener un cliente por ID
router.get('/:id', obtenerClientePorId);

// Ruta para actualizar un cliente por ID
router.put('/:id', actualizarCliente);

// Ruta para eliminar un cliente por ID
router.delete('/:id', eliminarCliente);

module.exports = router;
