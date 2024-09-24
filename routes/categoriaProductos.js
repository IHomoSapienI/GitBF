const { Router } = require('express');
const { getCategorias, getCategoriaById, crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categoriaProducto');

const router = Router();

// Obtener todas las categorías
router.get('/', getCategorias);

// Obtener una categoría por ID
router.get('/:id', getCategoriaById);

// Crear una nueva categoría
router.post('/', crearCategoria);

// Actualizar una categoría existente
router.put('/:id', actualizarCategoria);

// Eliminar una categoría
router.delete('/:id', eliminarCategoria);

module.exports = router;
