 // Usa bcryptjs para mantener la consistencia
const jwt = require('jsonwebtoken');
const User = require('../modules/usuario'); // Asegúrate de tener un modelo de Usuario
const Rol = require('../modules/rol'); // Importa el modelo de Rol si lo usas para la validación
const { createUser } = require('../controllers/userHelper');
const bcrypt = require('bcryptjs');
// Controlador para login
const login = async (req, res) => {
    const { email, password } = req.body;

    console.log('Inicio de sesión - Email:', email); 

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Log del usuario encontrado
        console.log('Usuario encontrado:', JSON.stringify(user, null, 2));

        console.log('Longitud de la contraseña ingresada:', password.length); 

        // Verificar si la contraseña es correcta
        console.log('Contraseña ingresada para el login:', password);
        console.log('Contraseña almacenada para el usuario:', user.password);
        console.log('Comparando contraseñas...');
        const isMatch = await bcrypt.compare(password.trim(), user.password);

        console.log('Resultado de bcrypt.compare:', isMatch);
        
        if (!isMatch) {
            console.log('Contraseña incorrecta');
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Generar un token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        console.log('Token generado:', token);
        res.json({ token });
    } catch (error) {
        console.error('Error en el login:', error); 
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Controlador para registro
const register = async (req, res) => {
    const { nombre, email, password, confirmPassword, rol, estado } = req.body;

    console.log('Registro - Datos recibidos:', {
        nombre,
        email,
        rol,
        estado,
    });

    try {
        // Validar campos obligatorios
        if (!nombre || !email || !password || !confirmPassword || !rol) {
            console.log('Faltan campos obligatorios');
            return res.status(400).json({
                msg: 'Faltan campos obligatorios (nombre, email, password, confirmPassword o rol)',
            });
        }

        // Verificar que la contraseña y la confirmación coincidan
        if (password !== confirmPassword) {
            console.log('Las contraseñas no coinciden');
            return res.status(400).json({
                msg: 'Las contraseñas no coinciden',
            });
        }

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('El usuario ya existe:', email);
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        console.log('El usuario no existe, procediendo a verificar el rol...');

        // Verificar si el rol existe
        const existeRol = await Rol.findById(rol);
        if (!existeRol) {
            console.log('El rol especificado no es válido:', rol);
            return res.status(400).json({
                msg: 'El rol especificado no es válido',
            });
        }
        console.log('Contraseña recibida para el registro:', password); 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Llamar a la función createUser para crear y guardar el usuario
        const newUser = await createUser({ nombre, email, password, rol, estado });
        console.log('Usuario guardado en la base de datos:', JSON.stringify(newUser, null, 2));

        // Generar un token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        console.log('Token generado:', token);

        res.json({ token });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


module.exports = {
    login,
    register,
};
