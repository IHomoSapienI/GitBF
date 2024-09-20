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
        cb(null, Date.now() + file.originalname); // Renombra el archivo
    }
});

const upload = multer({ storage: storage });

// Rutas
router.get('/', serviciosGet);
router.post('/', upload.single('imagen'), serviciosPost); // Cambia 'imagen' por el nombre del campo en tu formulario
router.put('/:id', upload.single('imagen'), serviciosPut);  // Actualizar un servicio
router.delete('/:id', serviciosDelete);

module.exports = router;
