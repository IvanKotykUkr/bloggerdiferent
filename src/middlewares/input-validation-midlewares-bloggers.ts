import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";


export const nameValidation = body('name')
    .trim()
    .isString().withMessage("Should be String")
    .isLength({min: 2, max: 15}).withMessage("Should be a length 15")
export const youtubeUrlValidation = body('youtubeUrl')
    .isString().withMessage("Should be String")
    .isURL().withMessage("Should be URL")
    .isLength({}).withMessage("Should be a length between 2 and 15")

export const inputValidationBlogger = (req: Request, res: Response, next: NextFunction) => {
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
