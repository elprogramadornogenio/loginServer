"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const enviorenment_1 = require("../global/enviorenment");
class Imagen {
    constructor() {
        this._cloudinary = cloudinary_1.v2.config({
            cloud_name: enviorenment_1.cloud_name,
            api_key: enviorenment_1.api_key,
            api_secret: enviorenment_1.api_secret
        });
    }
    static get instance() {
        return this._instance || (this._instance = new Imagen());
    }
    get cloudinary() {
        return cloudinary_1.v2;
    }
}
exports.default = Imagen;
//# sourceMappingURL=cloudinary.js.map