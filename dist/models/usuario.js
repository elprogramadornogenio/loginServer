"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const mongoose_1 = require("mongoose");
const UsuarioSchema = new mongoose_1.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    imagen: {
        type: String
    }
});
exports.Usuario = (0, mongoose_1.model)('Usuario', UsuarioSchema);
//# sourceMappingURL=usuario.js.map