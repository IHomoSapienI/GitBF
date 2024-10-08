const Permiso = require('../modules/permiso');
const Usuario = require('../modules/usuario'); // Importa el modelo de usuario

const verificarPermisos = (permisosRequeridos) => {
    return async (req, res, next) => {
        try {
            const userId = req.uid; // uid del middleware validarJWT
            console.log(`UID del usuario: ${userId}`); // Para verificar si uid está llegando correctamente

            const usuario = await Usuario.findById(userId).populate('rol');
            console.log(`Usuario encontrado: ${usuario}`); // Para verificar el usuario encontrado
            
            if (!usuario || !usuario.rol) {
                return res.status(403).json({ msg: 'Usuario o rol no encontrado' });
            }

            const permisosUsuario = usuario.rol.permisoRol; // IDs de permisos del rol
            console.log(`Permisos del usuario: ${permisosUsuario}`); // Para verificar los permisos

            const permisosValidos = await Permiso.find({ _id: { $in: permisosUsuario } });
            const permisosValidosNombres = permisosValidos.map(p => p.nombrePermiso);
            console.log(`Permisos válidos: ${permisosValidosNombres}`); // Para verificar los permisos válidos
            
            const tienePermisos = permisosRequeridos.every(permiso => permisosValidosNombres.includes(permiso));
            console.log(`¿Usuario tiene permisos? ${tienePermisos}`); // Para verificar si tiene permisos
            
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
