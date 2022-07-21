import {NextFunction, Request, Response} from "express";
import {UserType} from "../types/user-type";

import {userRepositories} from "../repositories/user-db-repositories";
import {accessAttemptsDbRepositories, RecordType} from "../repositories/access-attempts-db-repositories";


export const registrationMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    const checkEmail: UserType | null = await userRepositories.findLoginOrEmail(req.body.email)
    if (checkEmail !== null) {
        res.status(400).json({errorsMessages: [{message: "email is already used", field: "email"}]})
        return
    }

    const checkLogin: UserType | null = await userRepositories.findLoginOrEmail(req.body.login)
    if (checkLogin != null) {

        res.status(400).json({errorsMessages: [{message: "login already exist", field: "login"}]})
        return
    }
    next()
}
export const loginAuthMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    const user: UserType | null = await userRepositories.findLoginOrEmail(req.body.login)
    if (!user) {
        res.status(400).json({errorsMessages: [{message: " login is wrong", field: " login"}]})
        return
    }
  /*  if (!user.emailConfirmation.isConfirmed) {
        res.status(400).json({errorsMessages: [{message: "user not confirmed", field: "user"}]})
        return

    }

   */


    next()
}
export const registrationResendingMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepositories.findLoginOrEmail(req.body.email)

    if (!user) {
        res.status(400).json({errorsMessages: [{message: "user email doesnt exist", field: "email"}]})
        return
    }
    if (user.emailConfirmation.isConfirmed === true) {
        res.status(400).json({errorsMessages: [{message: "email already confirmed", field: "email"}]})
        return

    }
    next()
}
export const registrationConfirmMiddlewares = async (req: Request, res: Response, next: NextFunction) => {

    let user: UserType | null = await userRepositories.findUserByCode(req.body.code)

    if (!user) {
        res.status(400).json({errorsMessages: [{message: " code doesnt exist", field: "code"}]})
        return
    }


    if (false !== user.emailConfirmation.isConfirmed) {
        res.status(400).json({errorsMessages: [{message: "code already confirmed", field: "code"}]})
        return

    }

    if (user.emailConfirmation.expirationDate < new Date()) {
        res.status(400).json({errorsMessages: [{message: "code expired", field: "code"}]})
        return
    }
    next()
}

export const antiDosMiddlewares = async (req: Request, res: Response, next: NextFunction) => {

    const countAttempts = async (ip: string, date: Date, process: string): Promise<string> => {

        const createRecord: RecordType = {
            ip,
            date,
            process
        }
        const timeRequest = await accessAttemptsDbRepositories.createRecord(createRecord)
        return await countNumber(timeRequest)

    }


    const countNumber = async (timeRequest: any): Promise<string> => {
        const tooMach = "too mach"
        const allOk = "all ok"
        const countTimeRequest = timeRequest[5] - (timeRequest[0])

        if (countTimeRequest <= 10000) {
            return tooMach
        }
        return allOk


    }
    const checkIp: string = await countAttempts(req.ip, new Date(), req.url)


    if (checkIp == "too mach") {
        res.status(429).json({errorsMessages: [{message: "too mach request", field: "request"}]})

        return
    }

    next()

}

