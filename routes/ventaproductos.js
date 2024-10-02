const express = require('express');
const router = express.Router();
const {
    crearVenta,
    obtenerVentas,
    obtenerVentaPorId,
    actualizarVenta,
    eliminarVenta
} = require('../controllers/ventaProducto');

// Ruta para crear una nueva venta
router.post('/venta', crearVenta);

// Ruta para obtener todas las ventas
router.get('/ventas', obtenerVentas);

// Ruta para obtener una venta específica por ID
router.get('/venta/:id', obtenerVentaPorId);

// Ruta para actualizar una venta por ID
router.put('/venta/:id', actualizarVenta);

// Ruta para eliminar una venta por ID
router.delete('/venta/:id', eliminarVenta);

module.exports = router;
