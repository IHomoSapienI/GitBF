const express = require('express');
const {
    crearCompra,
    obtenerCompras,
    obtenerCompraPorId,
    actualizarCompra,
    eliminarCompra
} = require('../controllers/compra'); // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Ruta para crear una nueva compra
router.post('/', crearCompra);

// Ruta para obtener todas las compras
router.get('/', obtenerCompras);

// Ruta para obtener una compra por ID
router.get('/:id', obtenerCompraPorId);

// Ruta para actualizar una compra
router.put('/:id', actualizarCompra);

// Ruta para eliminar una compra
router.delete('/:id', eliminarCompra);

module.exports = router;
