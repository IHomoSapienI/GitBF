const { Router } = require('express');
const { 
    obtenerVentasProductos, 
    crearVentaProducto, 
    actualizarVentaProducto, 
    eliminarVentaProducto 
} = require('../controllers/ventaProducto');

const router = Router();

// Ruta para obtener todas las ventas de productos
router.get('/', obtenerVentasProductos);

// Ruta para crear una nueva venta de producto
router.post('/', crearVentaProducto);

// Ruta para actualizar una venta de producto existente
router.put('/:id', actualizarVentaProducto);

// Ruta para eliminar una venta de producto
router.delete('/:id', eliminarVentaProducto);

module.exports = router;
