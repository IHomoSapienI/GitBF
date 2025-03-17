// routes/clienteRoutes.js
const { Router } = require('express');
const { validarJWT } = require('../middlewares/verificartoken');
const verificarRolActivo = require('../middlewares/verificarRolActivo');
const verificarClientePropio = require('../middlewares/verificarClientePropio');
const { 
  getClienteData, 
  getClienteCompras, 
  getClienteServicios, 
  updateClienteData, 
  getClienteFacturas,
  getClienteStats
} = require('../controllers/clienteController');

const router = Router();

// Middleware global para todas las rutas
router.use(validarJWT);
router.use(verificarRolActivo);

// Obtener datos del cliente actual
router.get('/perfil', verificarClientePropio, getClienteData);

// Obtener datos de un cliente específico (solo admin/empleado o el propio cliente)
router.get('/:id', verificarClientePropio, getClienteData);

// Obtener compras del cliente
router.get('/:id/compras', verificarClientePropio, getClienteCompras);

// Obtener servicios contratados por el cliente
router.get('/:id/servicios', verificarClientePropio, getClienteServicios);

// Obtener facturas del cliente
router.get('/:id/facturas', verificarClientePropio, getClienteFacturas);

// Obtener estadísticas del cliente
router.get('/:id/stats', verificarClientePropio, getClienteStats);

// Actualizar datos del cliente
router.put('/:id', verificarClientePropio, updateClienteData);

module.exports = router;