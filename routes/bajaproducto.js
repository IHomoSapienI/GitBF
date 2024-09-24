const express = require('express');
const router = express.Router();
const { obtenerBajasProductos, crearBajaProducto, eliminarBajaProducto } = require('../controllers/bajaproducto');

// Obtener todas las bajas de productos
router.get('/', obtenerBajasProductos);

// Crear una nueva baja de producto
router.post('/', crearBajaProducto);

// Eliminar una baja de producto por ID
router.delete('/:id', eliminarBajaProducto);

module.exports = router;
