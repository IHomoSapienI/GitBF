const express = require('express');
const router = express.Router();
const { obtenerInsumos, crearInsumo, actualizarInsumo, eliminarInsumo, cambiarEstadoInsumo } = require('../controllers/insumo');

// Obtener todos los insumos
router.get('/', obtenerInsumos);

// Crear un nuevo insumo
router.post('/', crearInsumo);

// Actualizar un insumo por ID
router.put('/:id', actualizarInsumo);

// Eliminar un insumo por ID
router.delete('/:id', eliminarInsumo);

// Cambiar el estado de un insumo por ID
router.patch('/:id/estado', cambiarEstadoInsumo);

module.exports = router;
