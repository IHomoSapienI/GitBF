const express = require('express');
const { validarJWT } = require('../middlewares/verificartoken'); // Importar el middleware
const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
} = require('../controllers/usuario');

const router = express.Router();

// Ruta pública para registrar un usuario
router.post('/', usuariosPost);

// Ruta privada para obtener usuarios (requiere autenticación)
router.get('/', usuariosGet); 

// Ruta privada para actualizar un usuario (requiere autenticación)
router.put('/:id', usuariosPut); 

// Ruta privada para eliminar un usuario (requiere autenticación)
router.delete('/:id', usuariosDelete);

module.exports = router;
