const express = require('express');
const router = express.Router();
const { obtenerCompras, crearCompra, actualizarCompra, eliminarCompra, cambiarEstadoCompra } = require('../controllers/compra');

// Obtener todas las compras
router.get('/', obtenerCompras);

// Crear una nueva compra
router.post('/', crearCompra);

// Actualizar una compra por ID
router.put('/:id', actualizarCompra);

// Eliminar una compra por ID
router.delete('/:id', eliminarCompra);

// Cambiar el estado de una compra por ID
router.patch('/:id/estado', cambiarEstadoCompra);

module.exports = router;
