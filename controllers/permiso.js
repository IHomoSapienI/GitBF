const { response } = require('express');
const Permiso = require('../modules/permiso');

// Obtener todos los permisos
const permisosGet = async (req, res = response) => {
    try {
        const permisos = await Permiso.find(); // Consultar todos los documentos de la colección

        // Si no hay roles en la base de datos
        if (permisos.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron permisos en la base de datos'
            });
        }

        // Devolvemos los roles obtenidos
        res.json({
            permisos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener los roles'
        });
    }
};

module.exports = {
    permisosGet
};