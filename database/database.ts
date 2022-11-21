import mongoose from "mongoose";
import { DB_CNN } from "../global/enviorenment";

export default class Database {
    private static _instance: Database;
    private urlBase: string;

    constructor(){
        this.urlBase = DB_CNN;
    }

    public static get instance(){
        return this._instance || (this._instance = new Database());
    }

    public async dbConnection(){
        try {
            await mongoose.connect(this.urlBase, {});
            console.log('Base de datos conectada')
        } catch (error) {
            console.log(error);
            throw new Error('Error al momento de inicializar base de datos');
            
        }
    }
}