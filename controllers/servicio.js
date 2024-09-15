const { response } = require('express');
const Servicio = require('../modules/servicio');
const TipoServicio = require('../modules/tiposerv'); // Importar el modelo TipoServicio

// Obtener todos los servicios
const serviciosGet = async (req, res = response) => {
    try {
        const servicios = await Servicio.find(); // Consultar todos los documentos de la colección y poblar tipoServicio

        // Si no hay servicios en la base de datos
        if (servicios.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron servicios en la base de datos'
            });
        }

        res.json({
            servicios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener los servicios'
        });
    }
};


// Obtener detalles de un servicio específico
const servicioDetalleGet = async (req, res = response) => {
    const { id } = req.params;
    try {
        const servicio = await Servicio.findById(id).populate('tipoServicio');
        if (!servicio) {
            return res.status(404).json({
                msg: 'Servicio no encontrado'
            });
        }
        const detalles = await DetalleServicio.find({ servicio: id });
        res.json({
            servicio,
            detalles
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener el detalle del servicio'
        });
    }
};


// Crear un nuevo servicio
const serviciosPost = async (req, res = response) => {
    const { nombreServicio, descripcion, precio, tiempo, tipoServicio, estado } = req.body; // Extraer datos del cuerpo de la solicitud

    // Validar los datos recibidos
    if (!nombreServicio || !descripcion || precio === undefined || tiempo === undefined || !tipoServicio || estado === undefined) {
        return res.status(400).json({
            msg: 'Nombre, descripción, precio, tiempo, tipo de servicio y estado son obligatorios.'
        });
    }

    try {
        // Verificar si el tipo de servicio existe
        const existeTipoServicio = await TipoServicio.findById(tipoServicio);
        if (!existeTipoServicio) {
            return res.status(400).json({
                msg: 'El tipo de servicio especificado no existe en la base de datos.'
            });
        }

        // Crear una nueva instancia del modelo Servicio
        const servicio = new Servicio({ nombreServicio, descripcion, precio, tiempo, tipoServicio, estado });

        // Guardar el nuevo servicio en la base de datos
        await servicio.save();
        res.status(201).json({
            msg: 'Servicio creado correctamente',
            servicio
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear el servicio'
        });
    }
};

module.exports = {
    serviciosGet,
    serviciosPost,
    servicioDetalleGet
};
