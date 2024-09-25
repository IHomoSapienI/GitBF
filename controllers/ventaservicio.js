const { response } = require('express');
const mongoose = require('mongoose');
const Ventaservicio = require('../modules/ventaservicio'); 
const Cita = require('../modules/cita');
const Cliente = require('../modules/cliente'); // Importar el modelo Cliente

// Obtener todos los servicios
const ventaserviciosGet = async (req, res) => {
    try {
        const ventaservicios = await Ventaservicio.find()
            .populate('cita')
            .populate('cliente'); // Agregar populate para el cliente

        if (ventaservicios.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron ventas de servicios en la base de datos'
            });
        }

        res.json({
            ventaservicios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener las ventas de los servicios'
        });
    }
};

// Crear una nueva venta de servicio
const ventaserviciosPost = async (req, res = response) => {
    const { cita, cliente, duracion, precioTotal, estado } = req.body;

    // Validar campos obligatorios
    if (!cita || !cliente || !duracion || !precioTotal || estado === undefined) {
        return res.status(400).json({
            msg: 'Cita, cliente, duración, precio total y estado son obligatorios.'
        });
    }

    try {
        // Verificar que la cita y el cliente existan
        const existeCita = await Cita.findById(cita);
        if (!existeCita) {
            return res.status(400).json({
                msg: 'La cita especificada no existe en la base de datos.'
            });
        }

        const existeCliente = await Cliente.findById(cliente); // Verificar que el cliente exista
        if (!existeCliente) {
            return res.status(400).json({
                msg: 'El cliente especificado no existe en la base de datos.'
            });
        }

        // Crear la venta de servicio sin el campo detalle
        const ventaservicio = new Ventaservicio({ 
            cita, 
            cliente, 
            duracion, 
            precioTotal, 
            estado 
        });

        await ventaservicio.save();
        res.status(201).json({
            msg: 'Venta de servicio creada correctamente',
            ventaservicio
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear la venta de servicio'
        });
    }
};

// Actualizar una venta existente
const ventaserviciosPut = async (req, res = response) => {
    const { id } = req.params;
    const { cita, cliente, duracion, precioTotal, estado } = req.body;

    // Validar campos obligatorios
    if (!cita || !cliente || !duracion || !precioTotal || estado === undefined) {
        console.log('Datos recibidos para actualizar:', req.body);
        return res.status(400).json({
            msg: 'Cita, cliente, duración, precio total y estado son obligatorios.'
        });
    }

    try {
        const venta = await Ventaservicio.findById(id);
        if (!venta) {
            return res.status(404).json({
                msg: 'Venta de servicio no encontrada'
            });
        }

        // Verificar que la cita y el cliente existan
        const existeCita = await Cita.findById(cita);
        if (!existeCita) {
            return res.status(400).json({
                msg: 'La cita especificada no existe en la base de datos.'
            });
        }

        const existeCliente = await Cliente.findById(cliente); // Verificar que el cliente exista
        if (!existeCliente) {
            return res.status(400).json({
                msg: 'El cliente especificado no existe en la base de datos.'
            });
        }

        // Actualizar los campos de la venta
        venta.cita = cita;
        venta.cliente = cliente;
        venta.duracion = duracion;
        venta.precioTotal = precioTotal;
        venta.estado = estado;

        await venta.save();
        res.json({
            msg: 'Venta de servicio actualizada correctamente',
            venta
        });
    } catch (error) {
        console.error('Error al actualizar la venta de servicio:', error);
        res.status(500).json({
            msg: 'Error al actualizar la venta de servicio'
        });
    }
};

const ventaserviciosDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        const result = await Ventaservicio.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({
                msg: 'Venta de servicio no encontrada'
            });
        }

        res.json({
            msg: 'Venta de servicio eliminada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar la venta de servicio:', error);
        res.status(500).json({
            msg: 'Error al eliminar la venta de servicio'
        });
    }
};

module.exports = {
    ventaserviciosGet,
    ventaserviciosPost,
    ventaserviciosPut, 
    ventaserviciosDelete 
};
