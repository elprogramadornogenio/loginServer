import { Router } from "express";
import { check } from "express-validator/src/middlewares/validation-chain-builders";
import Usuarios from "../controllers/Usuario";
import ValidarCampos from "../middleware/validarCampos";
import ValidarAutenticacion from '../middleware/validarAutenticacion';
import ValidarJwt from "../middleware/validarJwt";
import cors from 'cors';

const routerUsuario = Router();

routerUsuario.post('/registrar', [
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').isLength({ min: 6 }),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    ValidarCampos.instance.validarCampos
], Usuarios.instance.crearUsuario);

routerUsuario.post('/login', [
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').isLength({ min: 6 }),
    ValidarCampos.instance.validarCampos
], Usuarios.instance.loginUsuario);

routerUsuario.post('/RecuperarPassword', [
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    ValidarCampos.instance.validarCampos
], Usuarios.instance.recuperarPassword);

routerUsuario.post('/editar', [
    check('_id', 'El _id es obligatorio').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    ValidarAutenticacion.instance.validarAutenticacion,
    ValidarCampos.instance.validarCampos
], Usuarios.instance.editarUsuario);

routerUsuario.post('/editarImagen/:_id', [
    ValidarAutenticacion.instance.validarAutenticacion
], Usuarios.instance.actualizarImagenPerfil);

routerUsuario.post('/cambiarPassword', [
    check('_id', 'El _id es obligatorio').isMongoId(),
    check('password', 'El password es obligatorio').isLength({ min: 6 }),
    check('newPassword', 'El new password es obligatorio').isLength({ min: 6 }),
    ValidarAutenticacion.instance.validarAutenticacion,
    ValidarCampos.instance.validarCampos
], Usuarios.instance.cambiarPassword);

routerUsuario.post('/revalidarToken', [
    ValidarJwt.instance.validarJWT
], Usuarios.instance.revalidarToken);

export default routerUsuario;