// middlewares/verificarPropietario.js
const Cliente = require('../modules/cliente');
const Usuario = require('../modules/usuario');

/**
 * Middleware para verificar si el usuario es propietario del recurso
 * o tiene un rol con permisos administrativos
 * @param {String} modelName - Nombre del modelo ('Cota', 'Compra', etc.)
 * @param {String} paramId - Nombre del parámetro de ruta que contiene el ID del recurso
 */
const verificarPropietario = (modelName, paramId = 'id') => {
  return async (req, res, next) => {
    try {
      // Obtener el ID del usuario desde el token JWT (establecido por validarJWT)
      const usuarioId = req.userId;
      
      if (!usuarioId) {
        return res.status(401).json({
          msg: "No autorizado - Se requiere autenticación"
        });
      }
      
      // Obtener el usuario con su rol
      const usuario = await Usuario.findById(usuarioId).populate('rol');
      
      if (!usuario) {
        return res.status(401).json({
          msg: "Usuario no encontrado"
        });
      }
      
      // Si el usuario tiene rol de Admin o Empleado, permitir acceso completo
      if (usuario.rol.nombreRol === 'Admin' || usuario.rol.nombreRol === 'Empleado') {
        return next();
      }
      
      // Para clientes, verificar si el recurso les pertenece
      if (usuario.rol.nombreRol === 'Cliente') {
        // Obtener el cliente asociado al usuario
        const cliente = await Cliente.findOne({ usuario: usuarioId });
        
        if (!cliente) {
          return res.status(403).json({
            msg: "No tienes un perfil de cliente asociado"
          });
        }
        
        // Obtener el ID del recurso de los parámetros de la ruta
        const recursoId = req.params[paramId];
        
        if (!recursoId) {
          return res.status(400).json({
            msg: `ID de ${modelName} no proporcionado`
          });
        }
        
        // Importar el modelo dinámicamente
        const Modelo = require(`../modules/${modelName.toLowerCase()}`);
        
        // Buscar el recurso
        const recurso = await Modelo.findById(recursoId);
        
        if (!recurso) {
          return res.status(404).json({
            msg: `${modelName} no encontrado`
          });
        }
        
        // Verificar si el cliente es propietario del recurso
        // Nota: Ajusta esta lógica según la estructura de tus modelos
        if (recurso.cliente && recurso.cliente.toString() !== cliente._id.toString()) {
          return res.status(403).json({
            msg: "No tienes permiso para acceder a este recurso"
          });
        }
        
        // Si todo está bien, continuar
        req.clienteId = cliente._id; // Guardar el ID del cliente para uso posterior
        next();
      } else {
        // Otros roles no permitidos
        return res.status(403).json({
          msg: "Rol no autorizado para esta operación"
        });
      }
    } catch (error) {
      console.error("Error en verificarPropietario:", error);
      res.status(500).json({
        msg: "Error al verificar propiedad del recurso",
        error: error.message
      });
    }
  };
};

module.exports = verificarPropietario;