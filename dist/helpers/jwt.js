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
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const enviorenment_1 = require("../global/enviorenment");
class JwtGenerate {
    static get instance() {
        return this._instance || (this._instance = new JwtGenerate());
    }
    generarJWT(uid, nombre, apellido) {
        const payload = { uid, nombre, apellido };
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.sign)(payload, enviorenment_1.SECRET_JWT, {
                expiresIn: '24h'
            }, (error, token) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    resolve(token);
                }
            });
        });
    }
    comprobarToken(token, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, jsonwebtoken_1.verify)(token, enviorenment_1.SECRET_JWT, (err, decoded) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        console.log(decoded);
                        resolve(decoded);
                    }
                });
            });
        });
    }
}
exports.default = JwtGenerate;
//# sourceMappingURL=jwt.js.map