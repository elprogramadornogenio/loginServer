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
const moment_1 = __importDefault(require("moment"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
class ValidarAutenticacion {
    static get instance() {
        return this._instance || (this._instance = new ValidarAutenticacion());
    }
    validarAutenticacion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorization } = req.headers;
                if (!authorization) {
                    return res.status(403).json({
                        msg: `No esta autenticado no tiene autorizacion para acceder a la información`
                    });
                }
                const token = authorization.split(" ")[1];
                const { exp } = yield jwt_1.default.instance.comprobarToken(token, res);
                if (exp <= (0, moment_1.default)().unix()) {
                    return res.status(401).json({
                        msg: "El token ha expirado"
                    });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    msg: "Error en el servidor"
                });
            }
        });
    }
}
exports.default = ValidarAutenticacion;
//# sourceMappingURL=validarAutenticacion.js.map