const express = require('express');
const router = express.Router();
const {
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    actualizarCita,
    eliminarCita
} = require('../controllers/cita');

// Definir las rutas para citas
router.post('/', crearCita);
router.get('/', obtenerCitas);
router.get('/:id', obtenerCitaPorId);
router.put('/:id', actualizarCita);
router.delete('/:id', eliminarCita);

module.exports = router;
