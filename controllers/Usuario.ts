import { Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import { generate } from 'generate-password';
import { Usuario } from "../models/usuario";
import { IUsuario } from '../interfaces/usuario';
import JwtGenerate from '../helpers/jwt';
import Email from '../helpers/email';
import Imagen from "../helpers/cloudinary";

export default class Usuarios {

    private static _instance: Usuarios;

    public static get instance() {
        return this._instance || (this._instance = new Usuarios());
    }

    public async crearUsuario(req: Request, res: Response) {

        const { usuario, email, password, nombre, apellido } = req.body;

        try {

            // usuario existe
            const usuarioCuenta = await Usuario.findOne({ usuario });
            if (usuarioCuenta) {
                return res.status(400).json({
                    ok: false,
                    msg: `El usuario: ${usuario} ya existe`
                });
            }
            // email existe
            const usuarioEmail = await Usuario.findOne({ email });
            if (usuarioEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: `El email: ${email} ya esta registrado`
                });
            }
            // crear cuenta de usuario
            const iusuario: IUsuario = {
                usuario,
                email,
                password,
                nombre,
                apellido
            }

            const dbUsuario = new Usuario(iusuario);

            const salt = bcryptjs.genSaltSync();
            dbUsuario.password = bcryptjs.hashSync(password, salt);

            const token = await JwtGenerate.instance.generarJWT(dbUsuario.id, nombre, apellido);

            await dbUsuario.save();

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
        } catch (error) {
            return res.status(500).json({
                ok: true,
                msg: `Error en el funcionamiento del servidor`
            });
        }
    }

    public async loginUsuario(req: Request, res: Response) {

        const { usuario, password } = req.body;

        try {
            const dbUser = await Usuario.findOne({ usuario });

            if (!dbUser) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo no existe'
                });
            }

            const validPassword = bcryptjs.compareSync(password, dbUser.password);

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El password no es correcto'
                });
            }

            const token = await JwtGenerate.instance.generarJWT(dbUser.id, dbUser.nombre, dbUser.apellido);

            let imagen = "";

            if (!dbUser.imagen) {
                imagen = 'https://res.cloudinary.com/dkdwgznvg/image/upload/v1666217579/no-photo-id-auth-server.png';
            } else {
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

        } catch (error) {
            return res.status(500).json({
                ok: true,
                msg: `Error en el funcionamiento del servidor`
            });
        }
    }

    public async recuperarPassword(req: Request, res: Response) {
        const { usuario, email } = req.body;

        try {
            const dbUser = await Usuario.findOne({ usuario });

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
            const passwordNew = generate({
                length: 6,
                numbers: true,
                uppercase: false
            });


            const _id = dbUser._id;

            const salt = bcryptjs.genSaltSync();

            const iuser: IUsuario = {
                nombre: dbUser.nombre,
                apellido: dbUser.apellido,
                email: dbUser.email,
                usuario: dbUser.usuario,
                password: bcryptjs.hashSync(passwordNew, salt)
            }

            const dbUsuario = await Usuario.updateOne({ _id }, {
                $set: iuser
            });

            if (!dbUsuario) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no se pudo actualizar'
                });
            }

            //Enviar contraseña a correo
            Email.instance.enviarEmail(email, usuario, passwordNew);

            return res.status(201).json({
                ok: true,
                msg: `Correo enviado a: ${email} satisfactoriamente`
            });


        } catch (error) {
            return res.status(500).json({
                ok: true,
                msg: `Error en el funcionamiento del servidor`
            });
        }
    }

    public async editarUsuario(req: Request, res: Response) {

        const { _id, nombre, apellido, usuario, email } = req.body;

        try {

            const dbUser = await Usuario.findOne({ usuario });

            if (dbUser && dbUser._id.toString() !== _id) {
                return res.status(400).json({
                    ok: false,
                    msg: `El usuario ${usuario} ya existe`
                });
            }

            const dbEmail = await Usuario.findOne({ email });

            if (dbEmail && dbEmail._id.toString() !== _id) {
                return res.status(400).json({
                    ok: false,
                    msg: `El email ${email} ya existe`
                });
            }

            const dbUsuario = await Usuario.findById({ _id });

            if (!dbUsuario) {
                return res.status(400).json({
                    ok: false,
                    msg: `El usuario con id ${_id} no existe`
                });
            }

            const iusuario: IUsuario = {
                nombre,
                apellido,
                usuario,
                email,
                password: dbUsuario?.password
            }

            const resUsuario = await Usuario.updateOne({ _id }, {
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



        } catch (error) {
            return res.status(500).json({
                ok: true,
                msg: `Error en el funcionamiento del servidor`
            });
        }

    }

    public async actualizarImagenPerfil(req: Request | any, res: Response) {

        const { _id } = req.params;

        console.log(req.files)

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen) {
            return res.status(400).json({
                msg: 'No hay imagen que subir'
            });
        }

        const dbUsuario = await Usuario.findById({ _id });

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
            Imagen.instance.cloudinary.uploader.destroy(public_id);
        }



        try {
            const { tempFilePath } = req.files.imagen;

            /* const {secure_url} = await cloudinary.instance.cloudinary.upload(tempFilePath); */

            const { secure_url } = await Imagen.instance.cloudinary.uploader.upload(tempFilePath);

            dbUsuario.imagen = secure_url;

            await dbUsuario.save();

            res.status(201).json({
                ok: true,
                imagen: dbUsuario.imagen
            })


        } catch (msg) {
            res.status(400).json({
                msg
            });
        }
    }

    public async cambiarPassword(req: Request, res: Response) {

        const { _id, password, newPassword } = req.body;

        try {

            const dbUsuario = await Usuario.findById(_id);
            if (!dbUsuario) {
                return res.status(400).json({
                    ok: false,
                    msg: `El usuario con id ${_id} no existe`
                });
            }

            const validPassword = bcryptjs.compareSync(password, dbUsuario.password);

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: `El password es incorrecto`
                });
            }

            const validNewPassword = bcryptjs.compareSync(newPassword, dbUsuario.password);

            if (validNewPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: `El nuevo password es igual al password antiguo`
                });
            }

            const salt = bcryptjs.genSaltSync();
            dbUsuario.password = bcryptjs.hashSync(newPassword, salt);

            dbUsuario.save();

            res.status(201).json({
                ok: true,
                msg: `El usuario ${dbUsuario.usuario} ha cambiado de contraseña`
            })


        } catch (error) {
            return res.status(500).json({
                ok: true,
                msg: `Error en el funcionamiento del servidor`
            });
        }
    }

    public async revalidarToken(req: Request | any, res: Response){

        const {uid, nombre, apellido} = req;

        const token = await JwtGenerate.instance.generarJWT(uid, nombre, apellido);

        return res.json({
            ok: true,
            uid,
            nombre,
            apellido,
            token
        });
    }

}