// routes/cotaRoutes.js
const { Router } = require('express');
const { validarJWT } = require('../middlewares/verificartoken');
const verificarRolActivo = require('../middlewares/verificarRolActivo');
const verificarPermisos = require('../middlewares/verificarPermisos');
const verificarPropietario = require('../middlewares/verificarPropietario');
const filtrarPorUsuario = require('../middlewares/filtrarPorUsuario');
const { 
  cotasGet, 
  cotaGetById, 
  cotasPost, 
  cotasPut, 
  cotasDelete 
} = require('../controllers/cotaController');

const router = Router();

// Middleware global para todas las rutas
router.use(validarJWT);
router.use(verificarRolActivo);

// Obtener todas las cotas (filtradas por cliente si es necesario)
router.get('/', 
  filtrarPorUsuario('Cota'), 
  cotasGet
);

// Obtener una cota específica
router.get('/:id', 
  verificarPropietario('Cota'), 
  cotaGetById
);

// Crear una nueva cota
router.post('/', 
  verificarPermisos(['crear_cota']), 
  filtrarPorUsuario('Cota'), 
  cotasPost
);

// Actualizar una cota
router.put('/:id', 
  verificarPermisos(['editar_cota']), 
  verificarPropietario('Cota'), 
  cotasPut
);

// Eliminar una cota
router.delete('/:id', 
  verificarPermisos(['eliminar_cota']), 
  verificarPropietario('Cota'), 
  cotasDelete
);

module.exports = router;