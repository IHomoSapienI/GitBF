const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
  const token = req.header('x-token'); // Obtiene el token del encabezado

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición',
    });
  }

  try {
    // Verifica el token y obtiene el userId
    const { userId } = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.userId = userId; // Cambié 'uid' a 'userId' para mantener la consistencia
    next(); // Pasa al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({
      msg: 'Token no válido',
    });
  }
};

module.exports = {
  validarJWT,
};
