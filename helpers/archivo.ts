import fileUpload from "express-fileupload";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class Archivo {

    private static _instance: Archivo;

    public static get instance() {
        return this._instance || (this._instance = new Archivo());
    }

    constructor() { }

    subirArchivo(files: fileUpload.FileArray, extensionesValidas=['png', 'jpg', 'jpeg'], carpeta='') {

        return new Promise((resolve, reject) => {

            const { archivo }: any = files;

            const nombreCortado = archivo.name.split('.');

            const extension = nombreCortado[nombreCortado.length - 1];

            if (!extensionesValidas.includes(extension)) {
                return reject(`La extensión ${extension} no es permitida por favor subir en ${extensionesValidas}`);
            }

            const nombreTemp = uuidv4() + '.' + extension;

            const uploadPath = path.join(__dirname, '../uploads/', carpeta , nombreTemp);

            archivo.mv(uploadPath, (err: any) => {
                console.log("error: ", err);
                if (err) {
                    reject(err);
                }

                //resolve(`El archivo se ha subido en ${uploadPath}`);
                resolve(nombreTemp);
            });
        })

    }
}