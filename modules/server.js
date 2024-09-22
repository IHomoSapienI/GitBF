const express = require('express');
const { dbConnection } = require('../database/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000; // Asegúrate de tener un puerto predeterminado
        this.usuariosPath = '/api/usuarios';
        this.rolesPath = '/api/roles';
        this.permisosPath = '/api/permisos';
        this.tiposerviciosPath = '/api/tiposervicios';
        this.serviciosPath = '/api/servicios';
        this.detalleserviciosPath = '/api/detalleservicios';
        this.ventaserviciosPath = '/api/ventaservicios';
        this.insumosPath = '/api/insumos';
        this.bajaproductosPath = '/api/bajaproductos';
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
            origin: 'http://localhost:3000',
        }));

        this.app.use(bodyParser.json()); // for parsing application/json

        this.app.use(express.static(path.join(__dirname, '../frontend/public'))); // Servir archivos estáticos del frontend
        // Para servir los archivos subidos
        this.app.use(express.static('uploads'));
        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

         
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.rolesPath, require('../routes/roles'));
        this.app.use(this.permisosPath, require('../routes/permisos'));
        this.app.use(this.tiposerviciosPath, require('../routes/tiposervs'));
        this.app.use(this.serviciosPath, require('../routes/servicios')); // Asegúrate de que esta ruta use multer
        this.app.use(this.detalleserviciosPath, require('../routes/detalleservicios'));
        this.app.use(this.ventaserviciosPath, require('../routes/ventaservicios'));
        this.app.use(this.insumosPath, require('../routes/insumos'));
        this.app.use(this.bajaproductosPath, require('../routes/bajaproductos'));
        this.app.use(this.authPath, require('../routes/auth'));
    }

    async connectDb() {
        await dbConnection();
    }
}

module.exports = Server;
