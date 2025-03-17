// middlewares/verificarClientePropio.js
const Usuario = require('../modules/usuario');
const Cliente = require('../modules/cliente');

/**
 * Middleware para verificar que un usuario solo pueda acceder a sus propios datos de cliente
 */
const verificarClientePropio = async (req, res, next) => {
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
      // Para operaciones que requieren un cliente específico, como en rutas con :id
      if (req.params.id) {
        // No hay restricciones para admin/empleado, pero guardamos el ID del cliente
        req.clienteId = req.params.id;
      }
      return next();
    }
    
    // Para clientes, verificar que solo accedan a sus propios datos
    if (usuario.rol.nombreRol === 'Cliente') {
      // Obtener el cliente asociado al usuario
      const cliente = await Cliente.findOne({ usuario: usuarioId });
      
      if (!cliente) {
        return res.status(403).json({
          msg: "No tienes un perfil de cliente asociado"
        });
      }
      
      // Si hay un ID en los parámetros, verificar que coincida con el cliente actual
      if (req.params.id && req.params.id !== cliente._id.toString()) {
        return res.status(403).json({
          msg: "No tienes permiso para acceder a los datos de otro cliente"
        });
      }
      
      // Guardar el ID del cliente en el request para uso posterior
      req.clienteId = cliente._id;
      
      // Si todo está bien, continuar
      next();
    } else {
      // Otros roles no permitidos
      return res.status(403).json({
        msg: "Rol no autorizado para esta operación"
      });
    }
  } catch (error) {
    console.error("Error en verificarClientePropio:", error);
    res.status(500).json({
      msg: "Error al verificar propiedad del cliente",
      error: error.message
    });
  }
};

module.exports = verificarClientePropio;