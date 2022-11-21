import { Router } from "express";
import Uploads from '../controllers/Uploads';

const routerUploads = Router();

routerUploads.post('/subirArchivo', Uploads.instance.cargarArchivo);

/* routerUploads.put('/:coleccion/:id', Uploads.instance.actualizarImagen); */

routerUploads.put('/:coleccion/:id', Uploads.instance.actualizarImagenCloudinary);

routerUploads.get('/:coleccion/:id', Uploads.instance.mostrarImagen);

export default routerUploads;