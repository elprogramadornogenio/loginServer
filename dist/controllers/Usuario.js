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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generate_password_1 = require("generate-password");
const usuario_1 = require("../models/usuario");
const jwt_1 = __importDefault(require("../helpers/jwt"));
const email_1 = __importDefault(require("../helpers/email"));
const cloudinary_1 = __importDefault(require("../helpers/cloudinary"));
class Usuarios {
    static get instance() {
        return this._instance || (this._instance = new Usuarios());
    }
    crearUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, email, password, nombre, apellido } = req.body;
            try {
                // usuario existe
                const usuarioCuenta = yield usuario_1.Usuario.findOne({ usuario });
                if (usuarioCuenta) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El usuario: ${usuario} ya existe`
                    });
                }
                // email existe
                const usuarioEmail = yield usuario_1.Usuario.findOne({ email });
                if (usuarioEmail) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El email: ${email} ya esta registrado`
                    });
                }
                // crear cuenta de usuario
                const iusuario = {
                    usuario,
                    email,
                    password,
                    nombre,
                    apellido
                };
                const dbUsuario = new usuario_1.Usuario(iusuario);
                const salt = bcryptjs_1.default.genSaltSync();
                dbUsuario.password = bcryptjs_1.default.hashSync(password, salt);
                const token = yield jwt_1.default.instance.generarJWT(dbUsuario.id, nombre, apellido);
                yield dbUsuario.save();
                let imagen = "";
                if (!dbUsuario.imagen) {
                    imagen = 'https://res.cloudinary.com/dkdwgznvg/image/upload/v1666217579/no-photo-id-auth-server.png';
                }
                return res.status(201).json({
                    ok: true,
                    uid: dbUsuario.id,
                    usuario,
                    email,
                    nombre,
                    apellido,
                    imagen,
                    token
                });
            }
            catch (error) {
                return res.status(500).json({
                    ok: true,
                    msg: `Error en el funcionamiento del servidor`
                });
            }
        });
    }
    loginUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, password } = req.body;
            try {
                const dbUser = yield usuario_1.Usuario.findOne({ usuario });
                if (!dbUser) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El correo no existe'
                    });
                }
                const validPassword = bcryptjs_1.default.compareSync(password, dbUser.password);
                if (!validPassword) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El password no es correcto'
                    });
                }
                const token = yield jwt_1.default.instance.generarJWT(dbUser.id, dbUser.nombre, dbUser.apellido);
                let imagen = "";
                if (!dbUser.imagen) {
                    imagen = 'https://res.cloudinary.com/dkdwgznvg/image/upload/v1666217579/no-photo-id-auth-server.png';
                }
                else {
                    imagen = dbUser.imagen;
                }
                return res.json({
                    ok: true,
                    uid: dbUser.id,
                    nombre: dbUser.nombre,
                    apellido: dbUser.apellido,
                    email: dbUser.email,
                    usuario: dbUser.usuario,
                    imagen,
                    token
                });
            }
            catch (error) {
                return res.status(500).json({
                    ok: true,
                    msg: `Error en el funcionamiento del servidor`
                });
            }
        });
    }
    recuperarPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, email } = req.body;
            try {
                const dbUser = yield usuario_1.Usuario.findOne({ usuario });
                if (!dbUser) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El usuario es incorrecto'
                    });
                }
                if (email != dbUser.email) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El email es incorrecto'
                    });
                }
                // Crear nueva contraseña
                const passwordNew = (0, generate_password_1.generate)({
                    length: 6,
                    numbers: true,
                    uppercase: false
                });
                const _id = dbUser._id;
                const salt = bcryptjs_1.default.genSaltSync();
                const iuser = {
                    nombre: dbUser.nombre,
                    apellido: dbUser.apellido,
                    email: dbUser.email,
                    usuario: dbUser.usuario,
                    password: bcryptjs_1.default.hashSync(passwordNew, salt)
                };
                const dbUsuario = yield usuario_1.Usuario.updateOne({ _id }, {
                    $set: iuser
                });
                if (!dbUsuario) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El usuario no se pudo actualizar'
                    });
                }
                //Enviar contraseña a correo
                email_1.default.instance.enviarEmail(email, usuario, passwordNew);
                return res.status(201).json({
                    ok: true,
                    msg: `Correo enviado a: ${email} satisfactoriamente`
                });
            }
            catch (error) {
                return res.status(500).json({
                    ok: true,
                    msg: `Error en el funcionamiento del servidor`
                });
            }
        });
    }
    editarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, nombre, apellido, usuario, email } = req.body;
            try {
                const dbUser = yield usuario_1.Usuario.findOne({ usuario });
                if (dbUser && dbUser._id.toString() !== _id) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El usuario ${usuario} ya existe`
                    });
                }
                const dbEmail = yield usuario_1.Usuario.findOne({ email });
                if (dbEmail && dbEmail._id.toString() !== _id) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El email ${email} ya existe`
                    });
                }
                const dbUsuario = yield usuario_1.Usuario.findById({ _id });
                if (!dbUsuario) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El usuario con id ${_id} no existe`
                    });
                }
                const iusuario = {
                    nombre,
                    apellido,
                    usuario,
                    email,
                    password: dbUsuario === null || dbUsuario === void 0 ? void 0 : dbUsuario.password
                };
                const resUsuario = yield usuario_1.Usuario.updateOne({ _id }, {
                    $set: iusuario
                });
                if (!resUsuario) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El usuario con id ${_id} no se pudo actualizar`
                    });
                }
                return res.status(201).json({
                    ok: true,
                    msg: `El usuario con id ${_id} se ha actualizado exitosamente`
                });
            }
            catch (error) {
                return res.status(500).json({
                    ok: true,
                    msg: `Error en el funcionamiento del servidor`
                });
            }
        });
    }
    actualizarImagenPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            console.log(req.files);
            if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen) {
                return res.status(400).json({
                    msg: 'No hay imagen que subir'
                });
            }
            const dbUsuario = yield usuario_1.Usuario.findById({ _id });
            if (!dbUsuario) {
                return res.status(400).json({
                    msg: `No existe el usuario con id ${_id}`
                });
            }
            if (dbUsuario.imagen) {
                // hay que borrar la imagen del cloudinary
                const nombreArr = dbUsuario.imagen.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [public_id] = nombre.split('.');
                //cloudinary.instance.cloudinary.uploader.destroy(public_id);
                cloudinary_1.default.instance.cloudinary.uploader.destroy(public_id);
            }
            try {
                const { tempFilePath } = req.files.imagen;
                /* const {secure_url} = await cloudinary.instance.cloudinary.upload(tempFilePath); */
                const { secure_url } = yield cloudinary_1.default.instance.cloudinary.uploader.upload(tempFilePath);
                dbUsuario.imagen = secure_url;
                yield dbUsuario.save();
                res.status(201).json({
                    ok: true,
                    imagen: dbUsuario.imagen
                });
            }
            catch (msg) {
                res.status(400).json({
                    msg
                });
            }
        });
    }
    cambiarPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, password, newPassword } = req.body;
            try {
                const dbUsuario = yield usuario_1.Usuario.findById(_id);
                if (!dbUsuario) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El usuario con id ${_id} no existe`
                    });
                }
                const validPassword = bcryptjs_1.default.compareSync(password, dbUsuario.password);
                if (!validPassword) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El password es incorrecto`
                    });
                }
                const validNewPassword = bcryptjs_1.default.compareSync(newPassword, dbUsuario.password);
                if (validNewPassword) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El nuevo password es igual al password antiguo`
                    });
                }
                const salt = bcryptjs_1.default.genSaltSync();
                dbUsuario.password = bcryptjs_1.default.hashSync(newPassword, salt);
                dbUsuario.save();
                res.status(201).json({
                    ok: true,
                    msg: `El usuario ${dbUsuario.usuario} ha cambiado de contraseña`
                });
            }
            catch (error) {
                return res.status(500).json({
                    ok: true,
                    msg: `Error en el funcionamiento del servidor`
                });
            }
        });
    }
    revalidarToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, nombre, apellido } = req;
            const token = yield jwt_1.default.instance.generarJWT(uid, nombre, apellido);
            return res.json({
                ok: true,
                uid,
                nombre,
                apellido,
                token
            });
        });
    }
}
exports.default = Usuarios;
//# sourceMappingURL=Usuario.js.map