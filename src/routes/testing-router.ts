import {Request, Response, Router} from "express";
import {testing} from "../repositories/db";

export const testingRouter = Router({})
testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await testing.deleteAllData()

        res.sendStatus(204)



})