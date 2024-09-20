const { Router } = require('express');
const router = Router();
const { serviciosGet, serviciosPost, serviciosPut, serviciosDelete } = require('../controllers/servicio');
const multer = require('multer');

// Configuración de multer para la subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombra el archivo con extensión
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Tipos permitidos
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: Archivo no permitido.'); // Error si no es un archivo permitido
    }
});

// Rutas
router.get('/', serviciosGet);
router.post('/', upload.single('imagen'), serviciosPost); // Cambia 'imagen' por el nombre del campo en tu formulario
router.put('/:id', upload.single('imagen'), serviciosPut);  // Actualizar un servicio
router.delete('/:id', serviciosDelete);

module.exports = router;
