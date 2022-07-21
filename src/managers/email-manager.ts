
import {emailAdapter} from "../adapters/email-adapter";

export const emailManager={

    async message(code:string){


        return ` <div><a href=https://some-front.com/confirm-registration?code=${code}>https://some-front.com/confirm-registration?code=${code}</a></div>`
    },
    async sendEmailConfirmationMessage(email:string,code:string){
        const message=await this.message(code)

        await emailAdapter.sendEmail(email,"registration",message)
       return
    },
    async resentEmailConfirmationMessage(email:string,code:string) {

        const message=await this.message(code)

        await emailAdapter.sendEmail(email,"resent registration code",message)
        return
    }

}