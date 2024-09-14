const { response } = require('express');
const mongoose = require('mongoose');
const Rol = require('../modules/rol'); // Importar el modelo de Rol
const Permiso = require('../modules/permiso');

// Método GET para obtener los roles
const rolesGet = async (req, res = response) => {
    try {
        const roles = await Rol.find(); // Consultar todos los documentos de la colección

        if (roles.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron roles en la base de datos'
            });
        }

        res.json({ roles });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener los roles'
        });
    }
};

// Método POST para crear un nuevo rol
const rolesPost = async (req, res = response) => {
    const { nombreRol, permisoRol, estadoRol } = req.body; // Extraer datos del cuerpo de la solicitud

    // Asegúrate de que permisoRol sea un arreglo
    let permisosArray;
    if (typeof permisoRol === 'string') {
        permisosArray = [permisoRol];
    } else if (Array.isArray(permisoRol)) {
        permisosArray = permisoRol;
    } else {
        return res.status(400).json({
            msg: 'El campo permisoRol debe ser un ID de permiso o un arreglo de IDs de permisos.'
        });
    }

    // Verificar que los IDs de permisos sean válidos
    if (!permisosArray.every(id => mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({
            msg: 'Lista de permisos inválida o IDs de permisos no válidos.'
        });
    }

    // Verificar que todos los permisos existan
    try {
        const permisosExistentes = await Permiso.find({ '_id': { $in: permisosArray } });
        if (permisosExistentes.length !== permisosArray.length) {
            return res.status(400).json({
                msg: 'Uno o más permisos no existen.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: 'Error al verificar permisos.'
        });
    }

    // Crear una nueva instancia del modelo Rol
    const rol = new Rol({ nombreRol, permisoRol: permisosArray, estadoRol });

    let msg = '';

    try {
        // Guardar el nuevo rol en la base de datos
        await rol.save();
        msg = 'Rol asignado correctamente';
    } catch (error) {
        console.log(error);

        if (error.name === 'ValidationError') {
            console.error(Object.values(error.errors).map(val => val.message));
            msg = Object.values(error.errors).map(val => val.message).join(', ');
        } else {
            msg = 'Error al crear el rol';
        }
    }

    res.json({ msg });
};

// Método PUT para actualizar un rol por su id
const rolesPut = async (req, res = response) => {
    const { id } = req.params;

    // Verificar si el rol con el id proporcionado existe
    const rol = await Rol.findById(id);
    if (!rol) {
        return res.status(404).json({
            msg: 'Rol no encontrado'
        });
    }

    const updatedRol = await Rol.findByIdAndUpdate(id, req.body, { new: true });

    res.json({
        updatedRol
    });
};

// Método DELETE para eliminar un rol por su id
const rolesDelete = async (req, res = response) => {
    const { id } = req.params;

    // Verificar si el rol con el id proporcionado existe
    const rol = await Rol.findById(id);
    if (!rol) {
        return res.status(404).json({
            msg: 'Rol no encontrado'
        });
    }

    await Rol.findByIdAndDelete(id);

    res.json({
        msg: 'Rol eliminado'
    });
};

module.exports = {
    rolesGet,
    rolesPost,
    rolesPut,
    rolesDelete
};
