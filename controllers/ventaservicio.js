const { response } = require('express');
const mongoose = require('mongoose');
const Ventaservicio = require('../modules/ventaservicio'); 
const Detalleservicio = require('../modules/detalleservicio');


// Obtener todos los servicios
const ventaserviciosGet = async (req, res = response) => {
    try {
        const ventaservicios = await Ventaservicio.find(); // Consultar todos los documentos de la colección y poblar tipoServicio

        // Si no hay servicios en la base de datos
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
    const { cita, detalle, cliente, duracion, precioTotal, estado } = req.body; // Extraer datos del cuerpo de la solicitud

    // Validar los datos recibidos
    if (!cita || !detalle || !cliente || !duracion || !precioTotal || estado === undefined) {
        return res.status(400).json({
            msg: 'Cita, detalle, cliente, duración, precio total y estado son obligatorios.'
        });
    }

    try {
        // Verificar si el detalle de servicio especificado existe
        const existeDetalleServicio = await Detalleservicio.findById(detalle);
        if (!existeDetalleServicio) {
            return res.status(400).json({
                msg: 'El detalle de servicio especificado no existe en la base de datos.'
            });
        }

        // Crear una nueva instancia del modelo Ventaservicio
        const ventaservicio = new Ventaservicio({ cita, detalle, cliente, duracion, precioTotal, estado });

        // Guardar la nueva venta de servicio en la base de datos
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
    const { cita, detalle, cliente, duracion, precioTotal, estado } = req.body;

    try {
        // Verificar si la venta existe
        const venta = await Ventaservicio.findById(id);
        if (!venta) {
            return res.status(404).json({
                msg: 'Venta de servicio no encontrada'
            });
        }

        // Verificar si el detalle de servicio especificado existe
        const existeDetalleServicio = await Detalleservicio.findById(detalle);
        if (!existeDetalleServicio) {
            return res.status(400).json({
                msg: 'El detalle de servicio especificado no existe en la base de datos.'
            });
        }

        // Actualizar la venta de servicio
        venta.cita = cita;
        venta.detalle = detalle;
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
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar la venta de servicio'
        });
    }
};

const ventaserviciosDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        // Eliminar la venta de servicio por ID
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
        console.log(error);
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