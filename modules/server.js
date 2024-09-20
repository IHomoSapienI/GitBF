const express = require('express');
const { dbConnection } = require('../database/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombra el archivo
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

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.rolesPath = '/api/roles';
        this.permisosPath = '/api/permisos';
        this.tiposerviciosPath = '/api/tiposervicios';
        this.serviciosPath = '/api/servicios';
        this.detalleserviciosPath = '/api/detalleservicios';
        this.ventaserviciosPath = '/api/ventaservicios';
        this.authPath = '/api/auth';
        this.middlewares();
        this.routes();
        this.connectDb();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Escuchando por el puerto ${this.port}`);
        });
    }

    middlewares() {
        // CORS
        this.app.use(cors({
            origin: '*',
        }));

        this.app.use(bodyParser.json()); // for parsing application/json

        this.app.use(express.static(__dirname + "/../frontend/public"));
        this.app.use(express.static('uploads')); // Para servir los archivos subidos
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.rolesPath, require('../routes/roles'));
        this.app.use(this.permisosPath, require('../routes/permisos'));
        this.app.use(this.tiposerviciosPath, require('../routes/tiposervs'));
        this.app.use(this.serviciosPath, require('../routes/servicios')); // Asegúrate de que esta ruta use multer
        this.app.use(this.detalleserviciosPath, require('../routes/detalleservicios'));
        this.app.use(this.ventaserviciosPath, require('../routes/ventaservicios'));
        this.app.use(this.authPath, require('../routes/auth'));

        // Ruta para servir React frontend
        /*this.app.get('/*', (req, res) => {
            res.sendFile(__dirname + '/../frontend/public/index.html');
        });*/
    }

    async connectDb() {
        await dbConnection();
    }
}

module.exports = Server;
