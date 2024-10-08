const express = require('express');
const {
    crearCompra,
    obtenerCompras,
    obtenerCompraPorId,
    actualizarCompra,
    eliminarCompra
} = require('../controllers/compra'); // Asegúrate de que la ruta sea correcta

const { validarJWT } = require('../middlewares/verificartoken'); // Asegúrate de que la ruta sea correcta
const verificarPermisos = require('../middlewares/verificarPermisos'); // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Ruta para crear una nueva compra
router.post('/', validarJWT, verificarPermisos(['crearCompras']), crearCompra);

// Ruta para obtener todas las compras
router.get('/', validarJWT, verificarPermisos(['verCompras']), obtenerCompras);

// Ruta para obtener una compra por ID
router.get('/:id', validarJWT, verificarPermisos(['verCompras']), obtenerCompraPorId);

// Ruta para actualizar una compra
router.put('/:id', validarJWT, verificarPermisos(['actualizarCompras']), actualizarCompra);

// Ruta para eliminar una compra
router.delete('/:id', validarJWT, verificarPermisos(['eliminarCompras']), eliminarCompra);

module.exports = router;
