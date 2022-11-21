"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const archivo_1 = require("../helpers/archivo");
const usuario_1 = require("../models/usuario");
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const enviorenment_1 = require("../global/enviorenment");
cloudinary_1.v2.config({
    cloud_name: enviorenment_1.cloud_name,
    api_key: enviorenment_1.api_key,
    api_secret: enviorenment_1.api_secret
});
class Uploads {
    constructor() {
    }
    static get instance() {
        return this._instance || (this._instance = new Uploads());
    }
    cargarArchivo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
                res.status(400).json({
                    msg: 'No hay archivos que subir'
                });
                return;
            }
            try {
                const pathCompleto = yield archivo_1.Archivo.instance.subirArchivo(req.files, undefined, "imgs");
                res.json({
                    path: pathCompleto
                });
            }
            catch (msg) {
                res.status(400).json({
                    msg
                });
            }
        });
    }
    actualizarImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
                res.status(400).json({
                    msg: 'No hay archivos que subir'
                });
                return;
            }
            const { id, coleccion } = req.params;
            let modelo;
            switch (coleccion) {
                case 'usuario':
                    modelo = yield usuario_1.Usuario.findById(id);
                    if (!modelo) {
                        return res.status(400).json({
                            msg: `No existe el usuario con id ${id}`
                        });
                    }
                    break;
                default:
                    return res.status(500).json({
                        msg: 'No se ha validado mas programas'
                    });
            }
            // limpiar imagenes previas
            if (modelo.imagen) {
                // hay que borrar la imagen del servidor
                const pathImagen = path_1.default.join(__dirname, '../uploads', coleccion, modelo.imagen);
                if (fs_1.default.existsSync(pathImagen)) {
                    fs_1.default.unlinkSync(pathImagen);
                }
            }
            try {
                const nombreArchivo = yield archivo_1.Archivo.instance.subirArchivo(req.files, undefined, coleccion);
                modelo.imagen = String(nombreArchivo);
                yield modelo.save();
                res.json({
                    path: modelo
                });
            }
            catch (msg) {
                res.status(400).json({
                    msg
                });
            }
        });
    }
    actualizarImagenCloudinary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
                res.status(400).json({
                    msg: 'No hay archivos que subir'
                });
                return;
            }
            const { id, coleccion } = req.params;
            let modelo;
            switch (coleccion) {
                case 'usuario':
                    modelo = yield usuario_1.Usuario.findById(id);
                    if (!modelo) {
                        return res.status(400).json({
                            msg: `No existe el usuario con id ${id}`
                        });
                    }
                    break;
                default:
                    return res.status(500).json({
                        msg: 'No se ha validado mas programas'
                    });
            }
            // limpiar imagenes previas
            if (modelo.imagen) {
                // hay que borrar la imagen del cloudinary
                const nombreArr = modelo.imagen.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [public_id] = nombre.split('.');
                cloudinary_1.v2.uploader.destroy(public_id);
            }
            try {
                const { tempFilePath } = req.files.archivo;
                const { secure_url } = yield cloudinary_1.v2.uploader.upload(tempFilePath);
                modelo.imagen = secure_url;
                yield modelo.save();
                res.json({
                    modelo
                });
            }
            catch (msg) {
                res.status(400).json({
                    msg
                });
            }
        });
    }
    mostrarImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, coleccion } = req.params;
            let modelo;
            switch (coleccion) {
                case 'usuario':
                    modelo = yield usuario_1.Usuario.findById(id);
                    if (!modelo) {
                        return res.status(400).json({
                            msg: `No existe el usuario con id ${id}`
                        });
                    }
                    break;
                default:
                    return res.status(500).json({
                        msg: 'No se ha validado mas programas'
                    });
            }
            if (modelo.imagen) {
                // hay que borrar la imagen del servidor
                const pathImagen = path_1.default.join(__dirname, '../uploads', coleccion, modelo.imagen);
                if (fs_1.default.existsSync(pathImagen)) {
                    return res.sendFile(pathImagen);
                }
            }
            const pathNoImagen = path_1.default.join(__dirname, '../assets/no-image.jpg');
            return res.sendFile(pathNoImagen);
        });
    }
}
exports.default = Uploads;
//# sourceMappingURL=Uploads.js.map