"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const enviorenment_1 = require("./global/enviorenment");
const database_1 = __importDefault(require("./database/database"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const uploads_routes_1 = __importDefault(require("./routes/uploads.routes"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// Crear servidor
const app = (0, express_1.default)();
// Base de datos
database_1.default.instance.dbConnection();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// CORS
app.use((0, cors_1.default)({
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
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
    limits: {
        fileSize: 10000000 //10mb
    },
}));
// Rutas
app.use('/', usuario_routes_1.default);
app.use('/', uploads_routes_1.default);
app.listen(enviorenment_1.SERVER_PORT, () => {
    console.log(`Servidor funcionando en el puerto ${enviorenment_1.SERVER_PORT}`);
});
//# sourceMappingURL=index.js.map