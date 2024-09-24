const express = require('express');
const router = express.Router();
const {
    getVentasProductos,
    createVentaProducto,
    updateVentaProducto,
    deleteVentaProducto
} = require('../controllers/ventaProducto');

// Obtener todas las ventas
router.get('/', getVentasProductos);

// Crear una nueva venta
router.post('/', createVentaProducto);

// Actualizar una venta
router.put('/:id', updateVentaProducto);

// Eliminar una venta
router.delete('/:id', deleteVentaProducto);

module.exports = router;
