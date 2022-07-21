import {NextFunction, Request, Response} from "express";

const auth = require('basic-auth')
export const basicAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    let user = await auth(req)
    const username: string = 'admin'
    const password: string = 'qwerty'
    if (user === undefined || user['name'] !== username || user['pass'] !== password) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="Node"')
        res.end('Unauthorized')
        return
    }
    next()

}