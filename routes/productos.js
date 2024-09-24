const { Router } = require('express');
const { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto } = require('../controllers/productos');

const router = Router();

// Crear un nuevo producto
router.post('/', crearProducto);

// Obtener todos los productos
router.get('/', obtenerProductos);

// Obtener un producto por ID
router.get('/:id', obtenerProductoPorId);

// Actualizar un producto
router.put('/:id', actualizarProducto);

// Eliminar un producto
router.delete('/:id', eliminarProducto);

module.exports = router;
