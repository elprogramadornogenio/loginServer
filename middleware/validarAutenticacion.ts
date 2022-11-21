import { NextFunction, Request, Response } from "express";
import moment from 'moment';
import JwtGenerate from "../helpers/jwt";

export default class ValidarAutenticacion {

    private static _instance: ValidarAutenticacion;

    public static get instance() {
        return this._instance || (this._instance = new ValidarAutenticacion());
    }

    async validarAutenticacion(req: Request, res: Response, next: NextFunction) {

        try {

            const { authorization } = req.headers;
            if (!authorization) {
                return res.status(403).json({
                    msg: `No esta autenticado no tiene autorizacion para acceder a la información`
                });
            }
            const token = authorization.split(" ")[1];
            const { exp }: any = await JwtGenerate.instance.comprobarToken(token, res);

            if (exp <= moment().unix()) {
                return res.status(401).json({
                    msg: "El token ha expirado"
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                msg: "Error en el servidor"
            });
        }



    }
}
