import nodemailer from "nodemailer";

export const emailAdapter = {

    async sendEmail(email: string, subject: string, text: string) {



        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "backendkotyk@gmail.com",
                pass: "hvvqigrcnnrrifly",
            },
        });


        let info = await transport.sendMail({
            from: '"Kotyk" <backendkotyk@gmail.com>',
            to: email,
            subject: subject,
            html: text,
        });
        return


    }
}