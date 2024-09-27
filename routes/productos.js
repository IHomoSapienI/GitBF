const { Router } = require('express');
const {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productos'); // Asegúrate de que la ruta sea correcta

const router = Router();

// Definición de las rutas
router.get('/', obtenerProductos); // Obtener todos los productos
router.post('/', crearProducto); // Crear un nuevo producto
router.put('/:id', actualizarProducto); // Actualizar un producto
router.delete('/:id', eliminarProducto); // Eliminar un producto

module.exports = router;
