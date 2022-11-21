import { ConfigOptions, v2 as cloudinary } from 'cloudinary'
import { api_key, api_secret, cloud_name } from "../global/enviorenment";

export default class Imagen {

    private static _instance: Imagen;
    private _cloudinary: ConfigOptions;

    public static get instance() {
        return this._instance || (this._instance = new Imagen());
    }

    constructor() {
        this._cloudinary = cloudinary.config({
            cloud_name,
            api_key,
            api_secret
        });
    }

    public get cloudinary (){
        return cloudinary;
    }

}