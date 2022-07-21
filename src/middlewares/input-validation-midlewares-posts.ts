import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";


export const titleValidation = body('title').trim(undefined)
    .isString().withMessage("Should be String")
    .isLength({min: 2, max: 30}).withMessage("Should be a length between 2 and 30")
export const shortDescriptionValidation = body('shortDescription')
    .trim()
    .isString().withMessage("Should be String")
    .isLength({min: 2, max: 100}).withMessage("Should be a length between 2 and 100")
export const contentValidation = body('content')
    .trim(undefined)
    .isString().withMessage("Should be String")
    .isLength({min: 2, max: 1000}).withMessage("Should be a length between 2 and 1000")
export const bloggerIdtValidation = body('bloggerId')
    .trim(undefined)
    .isString().withMessage("Should be String")


export const inputValidationPost = (req: Request, res: Response, next: NextFunction) => {
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
