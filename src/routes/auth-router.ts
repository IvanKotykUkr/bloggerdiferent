import {Request, Response, Router} from "express";


import {jwtService} from "../aplication/jwt-service";
import {


    loginValidation,
    passwordValidation,
    inputValidationAuth, codeValidation, emailValidation, refreshTokenValidation, tokenValidationAuth,
} from "../middlewares/input-validation-auth";
import {UserType} from "../types/user-type";
import {authService} from "../domain/auth-service";
import {emailManager} from "../managers/email-manager";
import {inputValidationUser, loginValidationUser, passwordValidationUser} from "../middlewares/input-validation-users";
import {
    antiDosMiddlewares, loginAuthMiddlewares,
    registrationConfirmMiddlewares,
    registrationMiddlewares, registrationResendingMiddlewares
} from "../middlewares/auth-validation-middleware";
import {authRefreshTokenMiddlewares, authValidationMiddleware} from "../middlewares/auth-access-middlewares";
import {tokenService} from "../domain/token-service";


export const authRouter = Router({})


authRouter.post('/login',
    antiDosMiddlewares,
    loginValidation,
    passwordValidation,
    inputValidationAuth,
    loginAuthMiddlewares,
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.password)
        if (user === "wrong password") {
            res.status(401).json({errorsMessages: [{message: "password  is wrong", field: " password"}]})
            return
        }
        if (user) {

            const accessToken = await jwtService.createAccessToken(user)
            const refreshToken = await jwtService.createRefreshToken(user)
            //  console.log('new token')
            //console.log('refreshtoken '+new Date(), refreshToken)
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true


            });
            res.status(200).send(accessToken)
            //console.log("req " + new Date())
            return
        }


    });
authRouter.post('/refresh-token',

    refreshTokenValidation,
    tokenValidationAuth,
    authRefreshTokenMiddlewares,
    async (req: Request, res: Response) => {
        const accessToken = await jwtService.createAccessToken(req.user.id)
        const refreshToken = await jwtService.createRefreshToken(req.user.id)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return res.status(200).send(accessToken)
    });
authRouter.post('/logout',

    refreshTokenValidation,
    tokenValidationAuth,
    authRefreshTokenMiddlewares,
    async (req: Request, res: Response) => {


        const token = await tokenService.saveTokenInBlacklist(req.headers.cookie!)
        if (token) {
            res.clearCookie("refreshToken")
            res.sendStatus(204)
            return
        }


    });
authRouter.post('/registration-confirmation',
    antiDosMiddlewares,

    codeValidation,
    inputValidationAuth,
    registrationConfirmMiddlewares,
    async (req: Request, res: Response) => {
        const result: string | boolean = await authService.confirmEmail(req.body.code)

        if (result === "All ok") {
            res.sendStatus(204)
            return
        }


    });

authRouter.post('/registration',
    antiDosMiddlewares,
    registrationMiddlewares,
    emailValidation,
    inputValidationAuth,
    loginValidationUser,

    passwordValidationUser,
    inputValidationUser,
    registrationMiddlewares,
    async (req: Request, res: Response) => {

        const user = await authService.createUserByAuth(req.body.login, req.body.email, req.body.password)

        if (user === "All ok") {
            res.status(204).json({message: "Successfully Registered", status: 204})
            return
        }


    });
authRouter.post('/registration-email-resending',
    antiDosMiddlewares,
    emailValidation,
    inputValidationUser,
    registrationResendingMiddlewares,
    async (req: Request, res: Response) => {

        const user: string | boolean = await authService.resentConfirmationCode(req.body.email)

        if (user === "All ok") {
            res.sendStatus(204)
            return
        }

    });
authRouter.get('/me', authValidationMiddleware, async (req: Request, res: Response) => {

    res.status(200).json({
        "email": req.user.email,
        "login": req.user.login,
        "userId": req.user.id
    })

});
/*
authRouter.get('/test',async (req: Request, res: Response) => {
    const dataToSecure = {
        dataToSecure: "This is the secret data in the cookie.",
    };
    res.cookie("loggedin", "true",{
        httpOnly: true,


    });

    res.send("Cookie sent!");
    return


});
authRouter.get('/test2',async (req: Request, res: Response) => {
    let response = "Not logged in!";

    if(req.cookies.logged == "true") {
        response = "Yup! You are logged in!";
    }

    res.send(response);
    return


});

 */
