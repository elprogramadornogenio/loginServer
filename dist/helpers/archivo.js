"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archivo = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
class Archivo {
    constructor() { }
    static get instance() {
        return this._instance || (this._instance = new Archivo());
    }
    subirArchivo(files, extensionesValidas = ['png', 'jpg', 'jpeg'], carpeta = '') {
        return new Promise((resolve, reject) => {
            const { archivo } = files;
            const nombreCortado = archivo.name.split('.');
            const extension = nombreCortado[nombreCortado.length - 1];
            if (!extensionesValidas.includes(extension)) {
                return reject(`La extensión ${extension} no es permitida por favor subir en ${extensionesValidas}`);
            }
            const nombreTemp = (0, uuid_1.v4)() + '.' + extension;
            const uploadPath = path_1.default.join(__dirname, '../uploads/', carpeta, nombreTemp);
            archivo.mv(uploadPath, (err) => {
                console.log("error: ", err);
                if (err) {
                    reject(err);
                }
                //resolve(`El archivo se ha subido en ${uploadPath}`);
                resolve(nombreTemp);
            });
        });
    }
}
exports.Archivo = Archivo;
//# sourceMappingURL=archivo.js.map