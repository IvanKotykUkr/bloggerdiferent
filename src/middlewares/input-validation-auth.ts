import {body, cookie, header, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";


export const loginValidation =  body('login',)
    .isString().withMessage("Should be String")
export const passwordValidation = body("password")
    .isString().withMessage("Should be String")
    .isLength({min: 6, max: 20}).withMessage("Should be a length from 6 to 15")
export const codeValidation=body('code')
    .isUUID(4).withMessage("Should be valide code ")
export const emailValidation = body("email")
    .isEmail().withMessage("Should be valide email")
export const refreshTokenValidation = cookie("refreshToken")
    .isJWT().withMessage("Should be valide JWT Token")

export const inputValidationAuth = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newError = errors.array()
        res.status(400).json({
            errorsMessages: newError.map(er => ({
                message: er.msg,
                field: er.param
            }))
        });
        return
    }
    next()


}

export const tokenValidationAuth = (req: Request, res: Response, next: NextFunction) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newError = errors.array()
        res.status(401).json({
            errorsMessages: newError.map(er => ({
                message: er.msg,
                field: er.param
            }))
        });
        return
    }
    next()
}