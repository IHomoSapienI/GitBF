const Permiso = require('../modules/permiso');
const Usuario = require('../modules/usuario'); // Importa el modelo de usuario

const verificarPermisos = (permisosRequeridos) => {
    return async (req, res, next) => {
        try {
            const userId = req.uid; // uid del middleware validarJWT
            const usuario = await Usuario.findById(userId).populate('rol');

            if (!usuario || !usuario.rol) {
                return res.status(403).json({ msg: 'Usuario o rol no encontrado' });
            }

            const permisosUsuario = usuario.rol.permisoRol; // IDs de permisos del rol
            
            const permisosValidos = await Permiso.find({ _id: { $in: permisosUsuario } });
            const permisosValidosNombres = permisosValidos.map(p => p.nombrePermiso);
            
            const tienePermisos = permisosRequeridos.every(permiso => permisosValidosNombres.includes(permiso));
            
            if (!tienePermisos) {
                return res.status(403).json({ msg: 'No tienes permiso para acceder a esta ruta' });
            }
            
            next(); // Permitir el acceso si tiene permisos
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error al verificar permisos' });
        }
    };
};

module.exports = verificarPermisos; // Asegúrate de que la exportación sea correcta
