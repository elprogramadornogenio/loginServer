import express from 'express';
import cors from 'cors';
import { SERVER_PORT } from './global/enviorenment';
import Database from './database/database';
import routerUsuario from './routes/usuario.routes';
import bodyParser from 'body-parser';
import routerUploads from './routes/uploads.routes';
import fileUpload from 'express-fileupload';



// Crear servidor
const app = express();

// Base de datos
Database.instance.dbConnection();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// CORS
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

// Carga de archivo
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
    limits: {
        fileSize: 10000000 //10mb
    },

}));

// Rutas
app.use('/', routerUsuario);
app.use('/', routerUploads);

app.listen(SERVER_PORT, () => {
    console.log(`Servidor funcionando en el puerto ${SERVER_PORT}`)
});
