const { response } = require("express")
const Permiso = require("../modules/permiso")
const Rol = require("../modules/rol")
const Usuario = require("../modules/usuario")

/**
 * Middleware para verificar si el usuario tiene los permisos necesarios
 * @param {Array} permisosRequeridos - Array de strings con los nombres de los permisos requeridos
 * @returns {Function} Middleware
 */
const verificarPermisos = (permisosRequeridos) => {
  return async (req, res = response, next) => {
    try {
      // Obtener el ID del usuario desde el request (establecido por el middleware validarJWT)
      const usuarioId = req.userId // Cambiado de req.usuario.id a req.userId para coincidir con verificartoken.js

      console.log(`ID de usuario en verificarPermisos: ${usuarioId}`)

      if (!usuarioId) {
        return res.status(401).json({
          msg: "Token no válido - usuario no existe en la petición",
        })
      }

      // Buscar el usuario en la base de datos
      const usuario = await Usuario.findById(usuarioId)
      if (!usuario) {
        return res.status(401).json({
          msg: "Token no válido - usuario no existe en DB",
        })
      }

      // Verificar si el usuario está activo
      if (!usuario.estado) {
        return res.status(401).json({
          msg: "Token no válido - usuario con estado: false",
        })
      }

      // Obtener el rol del usuario
      const rol = await Rol.findById(usuario.rol).populate("permisoRol")
      if (!rol) {
        return res.status(403).json({
          msg: "El usuario no tiene un rol asignado",
        })
      }

      // Verificar si el rol está activo
      if (!rol.estadoRol) {
        return res.status(403).json({
          msg: "El rol del usuario está desactivado",
        })
      }

      // Verificar si el usuario tiene los permisos necesarios
      const permisosUsuario = rol.permisoRol.map((permiso) => permiso.nombrePermiso)

      console.log(`Permisos del usuario: ${permisosUsuario.join(", ")}`)
      console.log(`Permisos requeridos: ${permisosRequeridos.join(", ")}`)

      // Verificar que los permisos requeridos existan y estén activos
      const tienePermisos = await Promise.all(
        permisosRequeridos.map(async (permisoRequerido) => {
          const permiso = await Permiso.findOne({ nombrePermiso: permisoRequerido })
          // Verificar que el permiso exista Y esté activo
          const tienePermiso = permiso && permiso.activo && permisosUsuario.includes(permisoRequerido)
          console.log(
            `Permiso ${permisoRequerido}: existe=${!!permiso}, activo=${permiso?.activo}, usuario lo tiene=${permisosUsuario.includes(permisoRequerido)}`,
          )
          return tienePermiso
        }),
      )

      if (!tienePermisos.every(Boolean)) {
        return res.status(403).json({
          msg: "No tienes permiso para acceder a esta ruta o alguno de los permisos requeridos está desactivado",
        })
      }

      // Si todo está bien, continuar con la ejecución
      next()
    } catch (error) {
      console.error("Error en verificarPermisos:", error)
      res.status(500).json({
        msg: "Error al verificar permisos",
      })
    }
  }
}

module.exports = verificarPermisos

