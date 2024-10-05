const { response } = require('express');
const Ventaservicio = require('../modules/ventaservicio');
const Cita = require('../modules/cita');
const Cliente = require('../modules/cliente');
const Servicio = require('../modules/servicio');

// Obtener todas las ventas de servicios
const ventaserviciosGet = async (req, res = response) => {
    try {
        const ventaservicios = await Ventaservicio.find()
            .populate('cliente', 'nombrecliente')
            .populate({
                path: 'cita',
                select: 'fechacita nombreempleado',
                populate: {
                    path: 'nombreempleado',
                    model: 'Empleado',
                    select: 'nombre'
                }
            })
            .populate('servicios.servicio', 'nombreServicio precio tiempo')
            .lean();

        if (ventaservicios.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron ventas de servicios en la base de datos'
            });
        }

        // Asegurarse de que todos los campos estén correctamente formateados
        const ventasFormateadas = ventaservicios.map(venta => ({
            ...venta,
            cliente: venta.cliente ? {
                _id: venta.cliente._id,
                nombrecliente: venta.cliente.nombrecliente || 'Nombre no disponible'
            } : null,
            cita: venta.cita ? {
                _id: venta.cita._id,
                fechacita: venta.cita.fechacita,
                nombreempleado: venta.cita.nombreempleado ? venta.cita.nombreempleado.nombre : 'Empleado no especificado'
            } : null,
            servicios: venta.servicios.map(servicio => ({
                ...servicio,
                nombreServicio: servicio.nombreServicio || 'Servicio no especificado'
            }))
        }));

        res.json({ ventaservicios: ventasFormateadas });
    } catch (error) {
        console.error('Error al obtener las ventas de los servicios:', error);
        res.status(500).json({
            msg: 'Error al obtener las ventas de los servicios'
        });
    }
};

// Crear una nueva venta de servicio
const ventaserviciosPost = async (req, res = response) => {
    const { cita, cliente, servicios, precioTotal, estado } = req.body;

    // Verificación de campos obligatorios
    if (!cita || !cliente || !servicios || !precioTotal || estado === undefined) {
        return res.status(400).json({
            msg: 'Cita, cliente, servicios, precio total y estado son obligatorios.'
        });
    }

    try {
        const [existeCita, existeCliente] = await Promise.all([
            Cita.findById(cita),
            Cliente.findById(cliente)
        ]);

        if (!existeCita || !existeCliente) {
            return res.status(400).json({
                msg: 'La cita o el cliente especificado no existe en la base de datos.'
            });
        }

        // Obtiene solo los IDs de los servicios
        const serviciosIds = servicios.map(servicio => servicio.servicio);
        const serviciosValidos = await Servicio.find({ _id: { $in: serviciosIds } });

        // Verificación de existencia de servicios
        if (serviciosValidos.length !== servicios.length) {
            return res.status(400).json({
                msg: 'Uno o más servicios no existen en la base de datos.'
            });
        }

        // Mapeo de servicios a formato adecuado
        const serviciosConTiempo = serviciosValidos.map(servicio => ({
            servicio: servicio._id,
            nombreServicio: servicio.nombreServicio,
            precio: servicio.precio,
            subtotal: servicio.precio, // Puedes ajustar el subtotal si es necesario
            tiempo: servicio.tiempo
        }));

        const ventaservicio = new Ventaservicio({ 
            cita, 
            cliente, 
            servicios: serviciosConTiempo,
            precioTotal, 
            estado
        });

        await ventaservicio.save();

        res.status(201).json({
            msg: 'Venta de servicio creada correctamente',
            ventaservicio
        });
    } catch (error) {
        console.error('Error al crear la venta de servicio:', error);
        res.status(500).json({
            msg: 'Error al crear la venta de servicio'
        });
    }
};

// Actualizar una venta de servicio
const ventaserviciosPut = async (req, res = response) => {
    const { id } = req.params;
    const { cita, cliente, servicios, precioTotal, estado } = req.body;

    // Verificación de campos obligatorios
    if (!cita || !cliente || !servicios || !precioTotal || estado === undefined) {
        return res.status(400).json({
            msg: 'Cita, cliente, servicios, precio total y estado son obligatorios.'
        });
    }

    try {
        const venta = await Ventaservicio.findById(id);
        if (!venta) {
            return res.status(404).json({
                msg: 'Venta de servicio no encontrada'
            });
        }

        const [existeCita, existeCliente] = await Promise.all([
            Cita.findById(cita),
            Cliente.findById(cliente)
        ]);

        if (!existeCita || !existeCliente) {
            return res.status(400).json({
                msg: 'La cita o el cliente especificado no existe en la base de datos.'
            });
        }

        const serviciosIds = servicios.map(servicio => servicio.servicio);
        const serviciosValidos = await Servicio.find({ _id: { $in: serviciosIds } });

        if (serviciosValidos.length !== servicios.length) {
            return res.status(400).json({
                msg: 'Uno o más servicios no existen en la base de datos.'
            });
        }

        const serviciosConTiempo = serviciosValidos.map(servicio => ({
            servicio: servicio._id,
            nombreServicio: servicio.nombreServicio,
            precio: servicio.precio,
            subtotal: servicio.precio, // Puedes ajustar el subtotal si es necesario
            tiempo: servicio.tiempo
        }));

        // Actualiza los campos de la venta
        venta.cita = cita;
        venta.cliente = cliente;
        venta.servicios = serviciosConTiempo;
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

// Eliminar una venta
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
