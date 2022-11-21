"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Uploads_1 = __importDefault(require("../controllers/Uploads"));
const routerUploads = (0, express_1.Router)();
routerUploads.post('/subirArchivo', Uploads_1.default.instance.cargarArchivo);
/* routerUploads.put('/:coleccion/:id', Uploads.instance.actualizarImagen); */
routerUploads.put('/:coleccion/:id', Uploads_1.default.instance.actualizarImagenCloudinary);
routerUploads.get('/:coleccion/:id', Uploads_1.default.instance.mostrarImagen);
exports.default = routerUploads;
//# sourceMappingURL=uploads.routes.js.map