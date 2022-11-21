import { Request, Response, NextFunction } from 'express';
import JwtGenerate from '../helpers/jwt';

export default class ValidarJwt {

    private static _instance: ValidarJwt;

    public static get instance() {
        return this._instance || (this._instance = new ValidarJwt());
    }

    constructor() { }

    public async validarJWT(req: Request | any, res: Response, next: NextFunction) {

        try {
            const { authorization } = req.headers;
            if (!authorization) {
                return res.status(401).json({
                    msg: `error no existe token`
                });
            }
            const token = authorization.split(" ")[1];
            const { uid, nombre, apellido }: any = await JwtGenerate.instance.comprobarToken(token, res);
            console.log(uid, nombre, apellido);
            req.uid = uid;
            req.nombre = nombre;
            req.apellido = apellido;



        } catch (error) {
            return res.status(500).json({
                msg: "Error en el servidor"
            });
        }

        next();
    }
}