const { response } = require("express")
const Rol = require("../modules/rol")
const Usuario = require("../modules/usuario")
const Cliente = require("../modules/cliente")
const Empleado = require("../modules/empleado")
const bcrypt = require("bcryptjs")

// Obtener todos los usuarios (sin mostrar contraseñas)
const usuariosGet = async (req, res = response) => {
  try {
    const usuarios = await Usuario.find().select("-password").populate("rol") // Añadimos populate para ver el rol

    res.json({
      usuarios,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      msg: "Error al obtener usuarios",
      error,
    })
  }
}

const usuariosPost = async (req, res = response) => {
  const { nombre, apellido, email, celular, password, confirmPassword, tipoUsuario } = req.body

  try {
    // Validar campos obligatorios
    if (!nombre || !apellido || !email || !celular || !password || !confirmPassword) {
      return res.status(400).json({
        msg: "Faltan campos obligatorios (nombre, apellido, email, celular, password, confirmPassword)",
      })
    }

    // Verificar que la contraseña y la confirmación coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({
        msg: "Las contraseñas no coinciden",
      })
    }

    // Verificar si el usuario ya existe
    const existeEmail = await Usuario.findOne({ email })
    if (existeEmail) {
      return res.status(400).json({
        msg: "El correo ya está en uso",
      })
    }

    // Verificar si el celular ya existe
    const existeCelular = await Usuario.findOne({ celular })
    if (existeCelular) {
      return res.status(400).json({
        msg: "El celular ya está en uso",
      })
    }

    // Buscar el rol según el tipo de usuario (si se especifica)
    let rol

    if (tipoUsuario === "cliente") {
      rol = await Rol.findOne({ nombreRol: "Cliente" })
    } else if (tipoUsuario === "empleado") {
      rol = await Rol.findOne({ nombreRol: "Empleado" })
    } else {
      // Si no se especifica el tipo, seguimos con la lógica original
      const usuarios = await Usuario.countDocuments()

      if (usuarios === 0) {
        // Asignar rol de Admin si es el primer usuario
        rol = await Rol.findOne({ nombreRol: "Admin" })
      } else {
        // Asignar rol de usuario por defecto
        rol = await Rol.findOne({ nombreRol: "Usuario" })
      }
    }

    // Verificar si el rol fue encontrado
    if (!rol) {
      return res.status(400).json({ msg: "El rol especificado no existe." })
    }

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10)
    const passwordEncriptada = bcrypt.hashSync(password, salt)

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      celular,
      password: passwordEncriptada,
      rol: rol._id,
      estado: true,
    })

    // Guardar usuario en la base de datos
    await nuevoUsuario.save()

    // Crear registro en la colección correspondiente según el rol
    if (tipoUsuario === "cliente") {
      const nuevoCliente = new Cliente({
        nombrecliente: nombre,
        apellidocliente: apellido,
        correocliente: email,
        celularcliente: celular,
        estadocliente: "Activo",
      })
      await nuevoCliente.save()
    } else if (tipoUsuario === "empleado") {
      const nuevoEmpleado = new Empleado({
        nombreempleado: nombre,
        apellidoempleado: apellido,
        correoempleado: email,
        telefonoempleado: celular,
        estadoempleado: "Activo",
      })
      await nuevoEmpleado.save()
    }

    // Eliminar el campo de la contraseña de la respuesta
    const { password: _, ...usuarioResponse } = nuevoUsuario.toObject() // Excluye 'password'

    res.status(201).json({
      msg: "Usuario registrado",
      usuario: usuarioResponse, // Retorna el usuario sin la contraseña
    })
  } catch (error) {
    console.error(error)
    let msg = "Error al registrar usuario"
    if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map((val) => val.message)
    }
    res.status(500).json({
      msg,
    })
  }
}

// Actualizar un usuario existente
const usuariosPut = async (req, res = response) => {
  const { id } = req.params
  const { email, nombre, apellido, celular, rol } = req.body

  try {
    // Verificar si el rol existe
    const existeRol = await Rol.findById(rol)
    if (rol && !existeRol) {
      return res.status(400).json({
        msg: "El rol especificado no es válido",
      })
    }

    // Obtener el usuario antes de actualizarlo
    const usuarioAnterior = await Usuario.findById(id).populate("rol")

    if (!usuarioAnterior) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      })
    }

    // Actualizar el usuario
    const usuario = await Usuario.findByIdAndUpdate(id, { nombre, apellido, celular, rol }, { new: true })
      .select("-password")
      .populate("rol")

    // Determinar si el rol ha cambiado
    const rolAnterior = usuarioAnterior.rol ? usuarioAnterior.rol.nombreRol : null
    const rolNuevo = usuario.rol ? usuario.rol.nombreRol : null

    // Actualizar o crear registro en Cliente/Empleado según corresponda
    if (rolNuevo === "Cliente") {
      // Buscar si ya existe un cliente con ese correo
      const clienteExistente = await Cliente.findOne({ correocliente: email || usuarioAnterior.email })

      if (clienteExistente) {
        // Actualizar cliente existente
        await Cliente.findByIdAndUpdate(clienteExistente._id, {
          nombrecliente: nombre || usuarioAnterior.nombre,
          apellidocliente: apellido || usuarioAnterior.apellido,
          celularcliente: celular || usuarioAnterior.celular,
        })
      } else {
        // Crear nuevo cliente
        const nuevoCliente = new Cliente({
          nombrecliente: nombre || usuarioAnterior.nombre,
          apellidocliente: apellido || usuarioAnterior.apellido,
          correocliente: email || usuarioAnterior.email,
          celularcliente: celular || usuarioAnterior.celular,
          estadocliente: "Activo",
        })
        await nuevoCliente.save()
      }

      // Si antes era empleado, eliminar ese registro
      if (rolAnterior === "Empleado") {
        await Empleado.findOneAndDelete({ correoempleado: usuarioAnterior.email })
      }
    } else if (rolNuevo === "Empleado") {
      // Buscar si ya existe un empleado con ese correo
      const empleadoExistente = await Empleado.findOne({ correoempleado: email || usuarioAnterior.email })

      if (empleadoExistente) {
        // Actualizar empleado existente
        await Empleado.findByIdAndUpdate(empleadoExistente._id, {
          nombreempleado: nombre || usuarioAnterior.nombre,
          apellidoempleado: apellido || usuarioAnterior.apellido,
          telefonoempleado: celular || usuarioAnterior.celular,
        })
      } else {
        // Crear nuevo empleado
        const nuevoEmpleado = new Empleado({
          nombreempleado: nombre || usuarioAnterior.nombre,
          apellidoempleado: apellido || usuarioAnterior.apellido,
          correoempleado: email || usuarioAnterior.email,
          telefonoempleado: celular || usuarioAnterior.celular,
          estadoempleado: "Activo",
        })
        await nuevoEmpleado.save()
      }

      // Si antes era cliente, eliminar ese registro
      if (rolAnterior === "Cliente") {
        await Cliente.findOneAndDelete({ correocliente: usuarioAnterior.email })
      }
    }

    res.json({
      msg: "Usuario modificado correctamente",
      usuario,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      msg: "Error al modificar usuario",
      error,
    })
  }
}

// Eliminar un usuario
const usuariosDelete = async (req, res = response) => {
  const { id } = req.params // Obtener el ID del parámetro de la ruta

  try {
    if (!id) {
      return res.status(400).json({
        msg: "El ID es necesario para eliminar el usuario",
      })
    }

    // Obtener el usuario antes de eliminarlo
    const usuario = await Usuario.findById(id)

    if (!usuario) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      })
    }

    // Eliminar registros relacionados en Cliente o Empleado
    await Cliente.findOneAndDelete({ correocliente: usuario.email })
    await Empleado.findOneAndDelete({ correoempleado: usuario.email })

    // Eliminar el usuario
    await Usuario.findByIdAndDelete(id)

    res.json({
      msg: "Usuario eliminado",
      usuario,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      msg: "Error al eliminar usuario",
      error,
    })
  }
}

// Consultar usuarios con parámetros (PromGet)
const PromGet = async (req, res = response) => {
  const { q, nombre, page = 1, limit } = req.query

  try {
    const usuarios = await Usuario.find() // Consultar todos los documentos de una colección

    // Log para verificar los usuarios
    usuarios.forEach((usuario) => console.log(usuario))

    res.json({
      msg: "Prom API controlador",
      q,
      nombre,
      page,
      limit,
      usuarios,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      msg: "Error al obtener usuarios",
      error,
    })
  }
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  PromGet,
}

