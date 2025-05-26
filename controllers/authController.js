const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../modules/usuario")
const Rol = require("../modules/rol")
const { createUser } = require("../controllers/userHelper")
const nodemailer = require("nodemailer")
const crypto = require("crypto")

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

// Verificación mejorada del transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Error al configurar el correo:", error)
  } else {
    console.log("Servidor de correo listo")
  }
})

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }).populate("rol")
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" })
    }

    if (!user.estado) {
      return res.status(401).json({
        message: "Tu cuenta ha sido desactivada. Por favor, contacta al administrador.",
        cuentaInactiva: true,
      })
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" })
    }

    if (!user.rol.estadoRol) {
      return res.status(403).json({
        message: "Tu rol ha sido desactivado. Contacta al administrador.",
        rolDesactivado: true,
      })
    }

    const token = jwt.sign(
      { userId: user._id, role: user.rol.nombreRol }, 
      process.env.JWT_SECRET || "secret_key", 
      { expiresIn: "1h" }
    )

    res.json({
      token,
      role: user.rol.nombreRol,
      user: {
        id: user._id,
        email: user.email,
        name: user.nombre,
      },
    })
  } catch (error) {
    console.error("Error en el login:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

const register = async (req, res) => {
  const { nombre, apellido, email, password, confirmPassword, rol, estado, celular } = req.body

  try {
    // Validaciones mejoradas
    if (!nombre || !apellido || !email || !password || !confirmPassword || !celular) {
      return res.status(400).json({
        msg: "Faltan campos obligatorios",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        msg: "Las contraseñas no coinciden",
      })
    }

    // Validación de formato de email
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
    if (!emailRegex.test(email.toLowerCase())) {
      return res.status(400).json({
        msg: "Formato de email inválido",
      })
    }

    const userExists = await User.findOne({ email: email.toLowerCase() })
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" })
    }

    let rolId
    if (rol) {
      const existeRol = await Rol.findById(rol)
      if (!existeRol || !existeRol.estadoRol) {
        return res.status(400).json({
          msg: "El rol especificado no es válido o está desactivado",
        })
      }
      rolId = rol
    } else {
      const defaultRol = await Rol.findOne({ nombreRol: "Cliente" })
      if (!defaultRol || !defaultRol.estadoRol) {
        return res.status(403).json({
          msg: "El rol por defecto está desactivado. Contacta al administrador.",
        })
      }
      rolId = defaultRol._id
    }

    const newUser = await createUser({
      nombre,
      apellido,
      email: email.toLowerCase(),
      password,
      rol: rolId,
      estado,
      celular,
    })

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.rol.nombreRol },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1h" }
    )

    res.json({
      token,
      role: newUser.rol.nombreRol,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.nombre,
      },
    })
  } catch (error) {
    console.error("Error en el registro:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// FUNCIÓN MEJORADA: Solicitar restablecimiento de contraseña
const requestPasswordReset = async (req, res) => {
  const { email } = req.body

  try {
    // Validación de entrada
    if (!email) {
      return res.status(400).json({
        message: "El email es obligatorio"
      })
    }

    // Validación de formato de email
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
    if (!emailRegex.test(email.toLowerCase())) {
      return res.status(400).json({
        message: "Formato de email inválido"
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate("rol")
    
    // Respuesta genérica por seguridad (no revelar si el email existe)
    const genericResponse = {
      message: "Si el correo existe en nuestra base de datos, recibirás un código para restablecer tu contraseña.",
      email: email.toLowerCase()
    }

    if (!user || !user.estado) {
      return res.status(200).json(genericResponse)
    }

    // Verificar si ya existe un token válido reciente (evitar spam)
    if (user.resetPasswordExpires && user.resetPasswordExpires > Date.now()) {
      const timeLeft = Math.ceil((user.resetPasswordExpires - Date.now()) / 60000)
      return res.status(429).json({
        message: `Ya se envió un código recientemente. Espera ${timeLeft} minutos antes de solicitar otro.`
      })
    }

    // Generar token de 6 dígitos
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Guardar token hasheado y fecha de expiración (15 minutos)
    const salt = await bcrypt.genSalt(10)
    user.resetPasswordToken = await bcrypt.hash(resetToken, salt)
    user.resetPasswordExpires = Date.now() + 900000 // 15 minutos

    await user.save({ validateBeforeSave: false })

    // Configuración del email mejorada
    const mailOptions = {
      from: `"NailsSoft" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Código de verificación para restablecer contraseña",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de verificación</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #e1e1e1; }
    .content { padding: 20px 0; }
    .code { font-size: 32px; letter-spacing: 5px; text-align: center; margin: 20px 0; padding: 20px; background-color: #f8f9fa; border: 2px dashed #007bff; border-radius: 8px; font-weight: bold; color: #007bff; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #e1e1e1; font-size: 12px; color: #777; }
    .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://gitbf.onrender.com/uploads/logo1.png" alt="NailsSoft Logo" style="max-width: 150px;">
      <h1>NailsSoft</h1>
    </div>
    <div class="content">
      <h2>Código de verificación</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Usa el siguiente código:</p>
      
      <div class="code">${resetToken}</div>
      
      <div class="warning">
        <strong>⚠️ Importante:</strong>
        <ul>
          <li>Este código expira en <strong>15 minutos</strong></li>
          <li>Solo úsalo si solicitaste el cambio</li>
          <li>Nunca compartas este código con nadie</li>
        </ul>
      </div>
      
      <p>Si no solicitaste este cambio, ignora este correo y tu cuenta permanecerá segura.</p>
    </div>
    <div class="footer">
      <p>Este es un correo automático, no respondas a este mensaje.</p>
      <p>&copy; ${new Date().getFullYear()} NailsSoft. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>`,
    }

    // Enviar email con manejo de errores mejorado
    try {
      await transporter.sendMail(mailOptions)
      console.log(`Código de verificación enviado a: ${email}`)
    } catch (emailError) {
      console.error("Error al enviar email:", emailError)
      // Limpiar token si falla el envío
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save({ validateBeforeSave: false })
      
      return res.status(500).json({
        message: "Error al enviar el correo. Intenta nuevamente."
      })
    }

    res.status(200).json(genericResponse)
  } catch (error) {
    console.error("Error al solicitar restablecimiento:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// FUNCIÓN MEJORADA: Verificar token de restablecimiento
const verifyResetToken = async (req, res) => {
  const { token, email } = req.body

  try {
    // Validaciones de entrada
    if (!token || !email) {
      return res.status(400).json({ 
        message: "Token y email son obligatorios" 
      })
    }

    // Validar formato del token
    if (!/^\d{6}$/.test(token)) {
      return res.status(400).json({ 
        message: "El código debe tener exactamente 6 dígitos" 
      })
    }

    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ 
        message: "El código ha expirado o es inválido" 
      })
    }

    // Verificar que el token coincida
    const isValid = await bcrypt.compare(token, user.resetPasswordToken)
    if (!isValid) {
      return res.status(400).json({ 
        message: "Código incorrecto" 
      })
    }

    // Generar token temporal para autorizar el restablecimiento
    const tempToken = jwt.sign(
      { 
        userId: user._id, 
        resetVerified: true,
        email: user.email 
      },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "15m" }
    )

    console.log(`Token verificado correctamente para: ${user.email}`)

    res.status(200).json({ 
      message: "Código verificado correctamente",
      resetToken: tempToken
    })
  } catch (error) {
    console.error("Error al verificar token:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// FUNCIÓN MEJORADA: Restablecer contraseña
const resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body

  try {
    // Validaciones de entrada
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ 
        message: "Todos los campos son obligatorios" 
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        message: "Las contraseñas no coinciden" 
      })
    }

    // Validaciones de contraseña
    if (password.length < 8 || password.length > 64) {
      return res.status(400).json({ 
        message: "La contraseña debe tener entre 8 y 64 caracteres" 
      })
    }

    if (/\s/.test(password)) {
      return res.status(400).json({ 
        message: "La contraseña no puede contener espacios" 
      })
    }

    // Verificar el token temporal
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key")
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ 
          message: "La sesión de restablecimiento ha expirado",
          expired: true 
        })
      }
      return res.status(401).json({ 
        message: "Token de autorización inválido",
        invalidToken: true 
      })
    }

    if (!decoded.resetVerified) {
      return res.status(401).json({ 
        message: "Autorización inválida" 
      })
    }

    // Buscar usuario
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(400).json({ 
        message: "Usuario no encontrado" 
      })
    }

    // Verificar que el usuario esté activo
    if (!user.estado) {
      return res.status(403).json({ 
        message: "La cuenta está desactivada" 
      })
    }

    // Hashear y guardar nueva contraseña
    const salt = await bcrypt.genSalt(12)
    user.password = await bcrypt.hash(password, salt)
    
    // Limpiar tokens de restablecimiento
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    console.log(`Contraseña restablecida correctamente para: ${user.email}`)

    res.status(200).json({ 
      message: "Contraseña restablecida correctamente" 
    })
  } catch (error) {
    console.error("Error al restablecer contraseña:", error)
    res.status(500).json({ 
      message: "Error en el servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

module.exports = {
  login,
  register,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
}