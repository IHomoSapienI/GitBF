const { response } = require('express');
const Permiso = require('../modules/permiso');

// Obtener todos los permisos
const permisosGet = async (req, res = response) => {
    try {
        const permisos = await Permiso.find();
        if (permisos.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron permisos en la base de datos'
            });
        }
        res.json({ permisos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener los permisos' });
    }
};

// Crear un nuevo permiso
const permisosPost = async (req, res = response) => {
    const { nombrePermiso, descripcion, activo } = req.body;
    if (!nombrePermiso || !descripcion || activo === undefined) {
        return res.status(400).json({
            msg: 'Nombre, descripción y estado activo del permiso son obligatorios.'
        });
    }
    const permiso = new Permiso({ nombrePermiso, descripcion, activo });
    try {
        await permiso.save();
        res.status(201).json({
            msg: 'Permiso creado correctamente',
            permiso
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear el permiso' });
    }
};

// Actualizar un permiso
const permisosPut = async (req, res = response) => {
    const { id } = req.params;
    const { nombrePermiso, descripcion, activo } = req.body;
    try {
        const permiso = await Permiso.findById(id);
        if (!permiso) {
            return res.status(404).json({ ok: false, msg: 'Permiso no encontrado' });
        }

        permiso.nombrePermiso = nombrePermiso || permiso.nombrePermiso;
        permiso.descripcion = descripcion || permiso.descripcion;
        permiso.activo = activo !== undefined ? activo : permiso.activo;

        await permiso.save();
        res.json({
            ok: true,
            msg: 'Permiso actualizado con éxito',
            permiso
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al actualizar el permiso' });
    }
};

// Eliminar un permiso
const permisosDelete = async (req, res = response) => {
    const { id } = req.params;
    try {
        const permiso = await Permiso.findByIdAndDelete(id);
        if (!permiso) {
            return res.status(404).json({ ok: false, msg: 'Permiso no encontrado' });
        }
        res.json({ ok: true, msg: 'Permiso eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al eliminar el permiso' });
    }
};

module.exports = {
    permisosGet,
    permisosPost,
    permisosPut,
    permisosDelete
};
