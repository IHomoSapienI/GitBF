const express = require('express');
const router = express.Router();
const { obtenerProveedores, crearProveedor, actualizarProveedor, eliminarProveedor, cambiarEstadoProveedor } = require('../controllers/proveedor');

// Obtener todos los proveedores
router.get('/', obtenerProveedores);

// Crear un nuevo proveedor
router.post('/', crearProveedor);

// Actualizar un proveedor por ID
router.put('/:id', actualizarProveedor);

// Eliminar un proveedor por ID
router.delete('/:id', eliminarProveedor);

// Cambiar el estado de un proveedor por ID
router.patch('/:id/estado', cambiarEstadoProveedor);

module.exports = router;
