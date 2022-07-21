import {NextFunction, Request, Response} from "express";
import {CommentResponseType} from "../types/commnet-type";
import {commentsService} from "../domain/comments-service";
import {UserFromTokenType} from "../types/user-type";
import {jwtService} from "../aplication/jwt-service";
import {usersService} from "../domain/users-service";
import {tokenService} from "../domain/token-service";
import * as bcrypt from "bcrypt";

export const authValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(401).json({
            errorsMessages: [{
                message: "there are no authorizations in the header ",
                field: "headers authorization"
            }]
        })
        return
    }

    const token: string = req.headers.authorization.split(' ')[1]

    const user: UserFromTokenType | null = await jwtService.getUserIdByAccessToken(token)
    if (!user) {
        res.status(401).json({errorsMessages: [{message: "Should be valide JWT Token", field: "token"}]})
        return
    }


    req.user = await usersService.findUserById(user.userId)


    if (req.user === null) {
        res.status(401).json({errorsMessages: [{message: "there is no user", field: "token"}]})
        return
    }
    next()


}
export const authMiddlewaresWithCheckOwn = async (req: Request, res: Response, next: NextFunction) => {
    const comment: CommentResponseType | null = await commentsService.findCommentsById(req.params.id)

    if (!comment) {
        res.status(404).json({errorsMessages: [{message: "no comment", field: "id"}]})
        return
    }

    if (req.user!.id.toString() !== comment.userId!.toString()) {

        res.sendStatus(403).json({errorsMessages: [{message: "not your own", field: "user"}]})
        return
    }

    next()
}
export const authRefreshTokenMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.cookie) {
        res.status(401).json({errorsMessages: [{message: "token", field: "cookie"}]})
        return
    }

    const refreshToken: string = req.headers.cookie.split('=')[1]

    const alreadyUsed = await tokenService.checkToken(refreshToken)
    if (alreadyUsed === true) {
        res.clearCookie("refreshToken")
        res.status(401).json({errorsMessages: [{message: "alreadyUsed", field: "refreshToken"}]})
        return
    }
   // const user:UserFromTokenType=jwtService.decodCode(refreshToken)
    const user: UserFromTokenType|string  = jwtService.getUserIdByRefreshToken(refreshToken)

   /* if (Date.now() >= user.exp * 1000) {
        await tokenService.saveTokenInBlacklist(req.headers.cookie)
        console.log('expired log')
        console.log('user', user)
        res.clearCookie("refreshToken")
        res.status(401).json({errorsMessages: [{message: "expired", field: "refreshToken"}]})
        return
    }

    */
    if (user==="expired") {
        await tokenService.saveTokenInBlacklist(req.headers.cookie)

        res.clearCookie("refreshToken")
        res.status(401).json({errorsMessages: [{message: "expired", field: "refreshToken"}]})
        return
    }


    const addToken = await tokenService.saveTokenInBlacklist(req.headers.cookie)
    if (addToken&&typeof user !== "string") {

            req.user = await usersService.findUserById(user.userId)

    }
    if (req.user === null) {
        res.status(401).json({errorsMessages: [{message: "there is no user", field: "token"}]})
        return
    }


    next()
}
