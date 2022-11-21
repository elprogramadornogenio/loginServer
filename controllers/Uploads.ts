import { Request, Response } from "express";
import fs from 'fs';
import { Archivo } from '../helpers/archivo';
import { Usuario } from '../models/usuario';
import path from 'path';

import { v2 as cloudinary } from 'cloudinary'

import { api_key, api_secret, cloud_name } from "../global/enviorenment";

cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});



export default class Uploads {

    private static _instance: Uploads;

    public static get instance() {
        return this._instance || (this._instance = new Uploads());
    }

    constructor() {
        
    }

    public async cargarArchivo(req: Request, res: Response) {

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            res.status(400).json({
                msg: 'No hay archivos que subir'
            });
            return;
        }

        try {
            const pathCompleto = await Archivo.instance.subirArchivo(req.files, undefined, "imgs");
            res.json({
                path: pathCompleto
            })
        } catch (msg) {
            res.status(400).json({
                msg
            });
        }
    }

    async actualizarImagen(req: Request, res: Response) {

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            res.status(400).json({
                msg: 'No hay archivos que subir'
            });
            return;
        }

        const { id, coleccion } = req.params;

        let modelo;

        switch (coleccion) {
            case 'usuario':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe el usuario con id ${id}`
                    });
                }

                break;

            default:
                return res.status(500).json({
                    msg: 'No se ha validado mas programas'
                });
        }
        // limpiar imagenes previas

        if (modelo.imagen) {
            // hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.imagen);

            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        try {
            const nombreArchivo = await Archivo.instance.subirArchivo(req.files, undefined, coleccion);
            modelo.imagen = String(nombreArchivo);

            await modelo.save();

            res.json({
                path: modelo
            })
        } catch (msg) {
            res.status(400).json({
                msg
            });
        }

    }

    async actualizarImagenCloudinary(req: Request | any, res: Response) {

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            res.status(400).json({
                msg: 'No hay archivos que subir'
            });
            return;
        }

        const { id, coleccion } = req.params;

        let modelo;

        switch (coleccion) {
            case 'usuario':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe el usuario con id ${id}`
                    });
                }

                break;

            default:
                return res.status(500).json({
                    msg: 'No se ha validado mas programas'
                });
        }
        // limpiar imagenes previas



        if (modelo.imagen) {
            // hay que borrar la imagen del cloudinary
            const nombreArr = modelo.imagen.split('/');
            const nombre = nombreArr[nombreArr.length -1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }



        try {
            const { tempFilePath } = req.files.archivo;

            const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
            
            modelo.imagen = secure_url;

            await modelo.save();

            res.json({
                modelo
            })


        } catch (msg) {
            res.status(400).json({
                msg
            });
        }

    }

    async mostrarImagen(req: Request, res: Response) {

        const { id, coleccion } = req.params;

        let modelo;

        switch (coleccion) {
            case 'usuario':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe el usuario con id ${id}`
                    });
                }

                break;

            default:
                return res.status(500).json({
                    msg: 'No se ha validado mas programas'
                });
        }

        if (modelo.imagen) {
            // hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.imagen);

            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }

        const pathNoImagen = path.join(__dirname, '../assets/no-image.jpg');

        return res.sendFile(pathNoImagen);
    }

}