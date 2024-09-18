const { response } = require('express');
const mongoose = require('mongoose');
const Ventaservicio = require('../modules/ventaservicio'); 
const Detalleservicio = require('../modules/detalleservicio');


// Obtener todos los servicios
// Obtener todos los servicios
// Ejemplo de uso
const ventaserviciosGet = async (req, res) => {
    try {
        const ventaservicios = await Ventaservicio.find()
            .populate({
                path: 'detalle',
                populate: {
                    path: 'servicio', // Campo en Detalleservicio que referencia a Servicio
                    model: 'Servicio' // Nombre del modelo de Servicio
                }
            });

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
    const { cita, detalle, cliente, duracion, precioTotal, estado } = req.body;

    if (!cita || !cliente || !duracion || !precioTotal || estado === undefined) {
        return res.status(400).json({
            msg: 'Cita, cliente, duración, precio total y estado son obligatorios.'
        });
    }

    try {
        if (detalle) {
            const existeDetalleServicio = await Detalleservicio.findById(detalle);
            if (!existeDetalleServicio) {
                return res.status(400).json({
                    msg: 'El detalle de servicio especificado no existe en la base de datos.'
                });
            }
        }

        const ventaservicio = new Ventaservicio({ cita, detalle, cliente, duracion, precioTotal, estado });

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
    const { cita, cliente, duracion, precioTotal, estado, detalle } = req.body;

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

        if (detalle) {
            const existeDetalleServicio = await Detalleservicio.findById(detalle);
            if (!existeDetalleServicio) {
                return res.status(400).json({
                    msg: 'El detalle de servicio especificado no existe en la base de datos.'
                });
            }
        }

        venta.cita = cita;
        venta.detalle = detalle || null;
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