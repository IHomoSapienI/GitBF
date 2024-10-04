const express = require('express');
const router = express.Router();
const {
    crearVentaProducto,
    obtenerVentasProductos,
    obtenerVentaProductoPorId,
    actualizarVentaProducto,
    eliminarVentaProducto
} = require('../controllers/ventaProducto');

// Ruta para crear una nueva venta de producto
router.post('/', crearVentaProducto); // Cambiado a '/' para que sea relativo a '/api/ventaproductos'

// Ruta para obtener todas las ventas de productos
router.get('/', obtenerVentasProductos); // Cambiado a '/' para que sea relativo a '/api/ventaproductos'

// Ruta para obtener una venta de producto específica por ID
router.get('/:id', obtenerVentaProductoPorId); // Cambiado a '/:id' para que sea relativo a '/api/ventaproductos'

// Ruta para actualizar una venta de producto por ID
router.put('/:id', actualizarVentaProducto); // Cambiado a '/:id' para que sea relativo a '/api/ventaproductos'

// Ruta para eliminar una venta de producto por ID
router.delete('/:id', eliminarVentaProducto); // Cambiado a '/:id' para que sea relativo a '/api/ventaproductos'

module.exports = router;
