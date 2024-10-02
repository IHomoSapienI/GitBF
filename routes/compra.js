const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compra');

// Rutas de compras
router.post('/compras', comprasController.crearCompra);       // Crear compra
router.get('/compras', comprasController.obtenerCompras);    // Obtener todas las compras
router.get('/compras/:id', comprasController.obtenerCompraPorId); // Obtener una compra por ID
router.put('/compras/:id', comprasController.actualizarCompra);   // Actualizar una compra por ID
router.delete('/compras/:id', comprasController.eliminarCompra);  // Eliminar una compra por ID

module.exports = router;
