const { response } = require('express');
const Tiposervicio = require('../modules/tiposerv.js');

// Obtener todos los permisos
const tiposerviciosGet = async (req, res = response) => {
    try {
        const tiposervicios = await Tiposervicio.find(); // Consultar todos los documentos de la colección

        // Si no hay permisos en la base de datos
        if (tiposervicios.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron tipos de servicios en la base de datos'
            });
        }

        // Devolvemos los permisos obtenidos
        res.json({
            tiposervicios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener los tipos de servicios'
        });
    }
};

// Crear un nuevo permiso
const tiposerviciosPost = async (req, res = response) => {
    const { nombreTs, activo } = req.body; // Extraer datos del cuerpo de la solicitud

    // Validar los datos recibidos
    if (!nombreTs || activo === undefined) {
        return res.status(400).json({
            msg: 'Nombre y estado activo del tiposervicio son obligatorios.'
        });
    }

    // Crear una nueva instancia del modelo Permiso
    const tiposervicio = new Tiposervicio({ nombreTs, activo });

    try {
        // Guardar el nuevo permiso en la base de datos
        await tiposervicio.save();
        res.status(201).json({
            msg: 'tiposervicio creado correctamente',
            tiposervicio
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear el tipo de servicio'
        });
    }
};

const tiposerviciosPut = async (req, res = response) => {
    const { id } = req.params;
    const { nombreTs, activo } = req.body;

    try {
        const tiposervicio = await Tiposervicio.findById(id);

        if (!tiposervicio) {
            return res.status(404).json({
                msg: 'Tipo de servicio no encontrado'
            });
        }

        // Actualizamos solo los campos que hayan sido proporcionados
        if (nombreTs !== undefined) tiposervicio.nombreTs = nombreTs;
        if (activo !== undefined) tiposervicio.activo = activo;

        await tiposervicio.save();
        res.json({
            msg: 'Tipo de servicio actualizado correctamente',
            tiposervicio
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar el tipo de servicio'
        });
    }
};


// Eliminar un tipo de servicio por ID
const tiposerviciosDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        // Buscar y eliminar el tipo de servicio
        const tiposervicio = await Tiposervicio.findByIdAndDelete(id);

        if (!tiposervicio) {
            return res.status(404).json({
                msg: 'Tipo de servicio no encontrado'
            });
        }

        res.json({
            msg: 'Tipo de servicio eliminado correctamente',
            tiposervicio
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al eliminar el tipo de servicio'
        });
    }
};


module.exports = {
    tiposerviciosGet,
    tiposerviciosPost,
    tiposerviciosPut,
    tiposerviciosDelete
};
