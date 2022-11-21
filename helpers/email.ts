import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default class Email {

    private static _instance: Email;
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    public static get instance() {
        return this._instance || (this._instance = new Email());
    }

    constructor() {

        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'elprogramador.nogenio@gmail.com', // generated ethereal user
                pass: 'tgkiglnchthhfjbx', // generated ethereal password
            },
        });


    }

    public verificarEmail() {
        this.transporter.verify().then(() => {
            console.log('Listo para enviar emails');
        });
    }

    public async enviarEmail(email: string, usuario: string, passwordNew: string) {
        return await this.transporter.sendMail({
            from: '"Recuperación de Contraseña 👻" <elprogramador.nogenio@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Recuperacion de contraseña ✔", // Subject line
            html: `<b>Su usuario es: ${usuario} y su contraseña será: ${passwordNew} por favor cambie su contraseña</b>`, // html body
        });
    }


}