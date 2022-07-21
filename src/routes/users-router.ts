import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {basicAuthorization} from "../middlewares/basicAuth";
import {inputValidationUser, loginValidationUser, passwordValidationUser} from "../middlewares/input-validation-users";
import {UserRoutType} from "../types/user-type";
import {authService} from "../domain/auth-service";
import {emailValidation, inputValidationAuth} from "../middlewares/input-validation-auth";

export const usersRouter = Router({})
usersRouter.get('/', async (req: Request, res: Response) => {
    const pagenumber = req.query.PageNumber || 1;
    const pagesize = req.query.PageSize || 10;
    const users = await usersService.getAllUsers(+pagenumber, +pagesize)
    res.status(200).send(users)

});

usersRouter.post('/',
    basicAuthorization,
    emailValidation,
    inputValidationAuth,
    loginValidationUser,

    passwordValidationUser,
    inputValidationUser,

    async (req: Request, res: Response) => {
        const newUser: UserRoutType | null = await usersService.createUserByUser(req.body.login, req.body.email, req.body.password, req.ip)
        if(newUser===null){
            res.sendStatus(400)
            return
        }
        res.status(201).send(newUser)
    });
usersRouter.delete('/:id', basicAuthorization, async (req: Request, res: Response) => {
    const isDeleted: boolean = await usersService.deleteUser(req.params.id);
    if (isDeleted) {
        res.sendStatus(204)
        return
    }

    res.sendStatus(404)


})

