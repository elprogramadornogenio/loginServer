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
const nodemailer_1 = __importDefault(require("nodemailer"));
class Email {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'elprogramador.nogenio@gmail.com',
                pass: 'tgkiglnchthhfjbx', // generated ethereal password
            },
        });
    }
    static get instance() {
        return this._instance || (this._instance = new Email());
    }
    verificarEmail() {
        this.transporter.verify().then(() => {
            console.log('Listo para enviar emails');
        });
    }
    enviarEmail(email, usuario, passwordNew) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transporter.sendMail({
                from: '"Recuperación de Contraseña 👻" <elprogramador.nogenio@gmail.com>',
                to: email,
                subject: "Recuperacion de contraseña ✔",
                html: `<b>Su usuario es: ${usuario} y su contraseña será: ${passwordNew} por favor cambie su contraseña</b>`, // html body
            });
        });
    }
}
exports.default = Email;
//# sourceMappingURL=email.js.map