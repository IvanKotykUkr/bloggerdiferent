import {body, param, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

export const commentValidation = body('content')
    .isString().withMessage("Should be String")
    .isLength({min: 20, max: 300}).withMessage("Should be a length between 20 and 300")


export const inputValidationComment = (req: Request, res: Response, next: NextFunction) => {
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