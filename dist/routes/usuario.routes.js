"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_chain_builders_1 = require("express-validator/src/middlewares/validation-chain-builders");
const Usuario_1 = __importDefault(require("../controllers/Usuario"));
const validarCampos_1 = __importDefault(require("../middleware/validarCampos"));
const validarAutenticacion_1 = __importDefault(require("../middleware/validarAutenticacion"));
const validarJwt_1 = __importDefault(require("../middleware/validarJwt"));
const routerUsuario = (0, express_1.Router)();
routerUsuario.post('/registrar', [
    (0, validation_chain_builders_1.check)('usuario', 'El usuario es obligatorio').not().isEmpty(),
    (0, validation_chain_builders_1.check)('email', 'El email es obligatorio').isEmail(),
    (0, validation_chain_builders_1.check)('password', 'El password es obligatorio').isLength({ min: 6 }),
    (0, validation_chain_builders_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, validation_chain_builders_1.check)('apellido', 'El apellido es obligatorio').not().isEmpty(),
    validarCampos_1.default.instance.validarCampos
], Usuario_1.default.instance.crearUsuario);
routerUsuario.post('/login', [
    (0, validation_chain_builders_1.check)('usuario', 'El usuario es obligatorio').not().isEmpty(),
    (0, validation_chain_builders_1.check)('password', 'El password es obligatorio').isLength({ min: 6 }),
    validarCampos_1.default.instance.validarCampos
], Usuario_1.default.instance.loginUsuario);
routerUsuario.post('/RecuperarPassword', [
    (0, validation_chain_builders_1.check)('usuario', 'El usuario es obligatorio').not().isEmpty(),
    (0, validation_chain_builders_1.check)('email', 'El email es obligatorio').isEmail(),
    validarCampos_1.default.instance.validarCampos
], Usuario_1.default.instance.recuperarPassword);
routerUsuario.post('/editar', [
    (0, validation_chain_builders_1.check)('_id', 'El _id es obligatorio').isMongoId(),
    (0, validation_chain_builders_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, validation_chain_builders_1.check)('apellido', 'El apellido es obligatorio').not().isEmpty(),
    (0, validation_chain_builders_1.check)('usuario', 'El usuario es obligatorio').not().isEmpty(),
    (0, validation_chain_builders_1.check)('email', 'El email es obligatorio').isEmail(),
    validarAutenticacion_1.default.instance.validarAutenticacion,
    validarCampos_1.default.instance.validarCampos
], Usuario_1.default.instance.editarUsuario);
routerUsuario.post('/editarImagen/:_id', [
    validarAutenticacion_1.default.instance.validarAutenticacion
], Usuario_1.default.instance.actualizarImagenPerfil);
routerUsuario.post('/cambiarPassword', [
    (0, validation_chain_builders_1.check)('_id', 'El _id es obligatorio').isMongoId(),
    (0, validation_chain_builders_1.check)('password', 'El password es obligatorio').isLength({ min: 6 }),
    (0, validation_chain_builders_1.check)('newPassword', 'El new password es obligatorio').isLength({ min: 6 }),
    validarAutenticacion_1.default.instance.validarAutenticacion,
    validarCampos_1.default.instance.validarCampos
], Usuario_1.default.instance.cambiarPassword);
routerUsuario.post('/revalidarToken', [
    validarJwt_1.default.instance.validarJWT
], Usuario_1.default.instance.revalidarToken);
exports.default = routerUsuario;
//# sourceMappingURL=usuario.routes.js.map