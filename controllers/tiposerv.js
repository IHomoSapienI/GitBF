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

// Actualizar un tipo de servicio por ID
const tiposerviciosPut = async (req, res = response) => {
    const { id } = req.params; // Extraer el ID de la URL
    const { nombreTs, activo } = req.body; // Extraer los datos a actualizar desde el cuerpo de la solicitud

    // Validar los datos recibidos
    if (!nombreTs || activo === undefined) {
        return res.status(400).json({
            msg: 'Nombre y estado activo del tiposervicio son obligatorios.'
        });
    }

    try {
        // Buscar el tipo de servicio por ID y actualizarlo
        const tiposervicio = await Tiposervicio.findByIdAndUpdate(id, { nombreTs, activo }, { new: true });

        // Verificar si se encontró el tipo de servicio
        if (!tiposervicio) {
            return res.status(404).json({
                msg: `El tipo de servicio con ID ${id} no fue encontrado.`
            });
        }

        // Devolver la respuesta con el tipo de servicio actualizado
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


module.exports = {
    tiposerviciosGet,
    tiposerviciosPost,
    tiposerviciosPut
};
