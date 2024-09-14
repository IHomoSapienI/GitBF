const { response } = require('express');
const Permiso = require('../modules/permiso');

// Obtener todos los permisos
const permisosGet = async (req, res = response) => {
    try {
        const permisos = await Permiso.find(); // Consultar todos los documentos de la colección

        // Si no hay permisos en la base de datos
        if (permisos.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron permisos en la base de datos'
            });
        }

        // Devolvemos los permisos obtenidos
        res.json({
            permisos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener los permisos'
        });
    }
};

// Crear un nuevo permiso
const permisosPost = async (req, res = response) => {
    const { nombrePermiso, descripcion, activo } = req.body; // Extraer datos del cuerpo de la solicitud

    // Validar los datos recibidos
    if (!nombrePermiso || !descripcion || activo === undefined) {
        return res.status(400).json({
            msg: 'Nombre, descripción y estado activo del permiso son obligatorios.'
        });
    }

    // Crear una nueva instancia del modelo Permiso
    const permiso = new Permiso({ nombrePermiso, descripcion, activo });

    try {
        // Guardar el nuevo permiso en la base de datos
        await permiso.save();
        res.status(201).json({
            msg: 'Permiso creado correctamente',
            permiso
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear el permiso'
        });
    }
};

module.exports = {
    permisosGet,
    permisosPost
};
