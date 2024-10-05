const { response } = require('express');
const Ventaservicio = require('../modules/ventaservicio'); 
const Cita = require('../modules/cita');
const Cliente = require('../modules/cliente');
const Servicio = require('../modules/servicio'); // Importa el modelo de Servicio

// Obtener todas las ventas de servicios
const ventaserviciosGet = async (req, res) => {
    try {
        const ventaservicios = await Ventaservicio.find()
            .populate({
                path: 'cita',
                populate: { path: 'servicios' } // Popula los servicios a través de la cita
            })
            .populate('cliente')
            .populate('servicios'); // Popula directamente los servicios en la venta

        if (ventaservicios.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron ventas de servicios en la base de datos'
            });
        }

        res.json({ ventaservicios });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener las ventas de los servicios'
        });
    }
};

const ventaserviciosPost = async (req, res = response) => {
    const { cita, cliente, servicios, precioTotal, estado } = req.body;

    // Validar campos obligatorios
    if (!cita || !cliente || !servicios || !precioTotal || estado === undefined) {
        return res.status(400).json({
            msg: 'Cita, cliente, servicios, precio total y estado son obligatorios.'
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

        const existeCliente = await Cliente.findById(cliente);
        if (!existeCliente) {
            return res.status(400).json({
                msg: 'El cliente especificado no existe en la base de datos.'
            });
        }

        // Verificar que los servicios existan y calcular la duración total
        const serviciosValidos = await Servicio.find({ _id: { $in: servicios } });
        if (serviciosValidos.length !== servicios.length) {
            return res.status(400).json({
                msg: 'Uno o más servicios no existen en la base de datos.'
            });
        }

        // Crear la venta de servicio
        const serviciosConTiempo = serviciosValidos.map(servicio => ({
            servicio: servicio._id,
            nombreServicio: servicio.nombreServicio,
            precio: servicio.precio,
            subtotal: servicio.precio, // Asumiendo que el subtotal es igual al precio aquí, ajusta si es necesario
            tiempo: servicio.tiempo // Incluir el tiempo del servicio
        }));

        const ventaservicio = new Ventaservicio({ 
            cita, 
            cliente, 
            servicios: serviciosConTiempo, // Usar los servicios con el tiempo incluido
            precioTotal, 
            estado
        });

        // Guardar la venta en la base de datos
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

const ventaserviciosPut = async (req, res = response) => {
    const { id } = req.params;
    const { cita, cliente, servicios, precioTotal, estado } = req.body;

    // Validar campos obligatorios
    if (!cita || !cliente || !servicios || !precioTotal || estado === undefined) {
        return res.status(400).json({
            msg: 'Cita, cliente, servicios, precio total y estado son obligatorios.'
        });
    }

    try {
        // Verificar que la venta de servicio existe
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

        const existeCliente = await Cliente.findById(cliente);
        if (!existeCliente) {
            return res.status(400).json({
                msg: 'El cliente especificado no existe en la base de datos.'
            });
        }

        // Verificar que los servicios existan y calcular la duración total
        const serviciosValidos = await Servicio.find({ _id: { $in: servicios } });
        if (serviciosValidos.length !== servicios.length) {
            return res.status(400).json({
                msg: 'Uno o más servicios no existen en la base de datos.'
            });
        }

        // Crear el nuevo array de servicios con tiempo
        const serviciosConTiempo = serviciosValidos.map(servicio => ({
            servicio: servicio._id,
            nombreServicio: servicio.nombreServicio,
            precio: servicio.precio,
            subtotal: servicio.precio, // Ajusta si es necesario
            tiempo: servicio.tiempo // Incluir el tiempo del servicio
        }));

        // Actualizar los campos de la venta
        venta.cita = cita;
        venta.cliente = cliente;
        venta.servicios = serviciosConTiempo; // Actualizar los servicios seleccionados
        venta.precioTotal = precioTotal;
        venta.estado = estado;

        // Guardar los cambios
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
