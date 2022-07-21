import jwt from 'jsonwebtoken'


import {settings} from "../settings";
import {ObjectId} from "mongodb";
import {UserFromTokenType, UserType} from "../types/user-type";
import {refreshTokenValidation} from "../middlewares/input-validation-auth";
const expired = "expired";
export const jwtService = {
    async createAccessToken(id:string): Promise<{ accessToken: string }> {


        const access: string = jwt.sign({userId: id}, settings.ACCESS_JWT_SECRET, {expiresIn: "11s"})

        return {accessToken: access}


    },
    async createRefreshToken(id:string): Promise<string> {

        const refresh: string = jwt.sign({userId: id}, settings.REFRESH_JWT_SECRET, {expiresIn: "21s"})


        return refresh


    },
    async getUserIdByAccessToken(token: string): Promise<UserFromTokenType | null> {
        try {


            // @ts-ignore
            return await jwt.verify(token, settings.ACCESS_JWT_SECRET)


        } catch (error) {
            return null
        }

    },
    decodCode(token: string):UserFromTokenType{
        try {


            // @ts-ignore
            return jwt.decode(token, settings.REFRESH_JWT_SECRET)


        } catch (error) {

            // @ts-ignore
            return

        }

    },
    getUserIdByRefreshToken(token: string): UserFromTokenType | string {
        try {


            // @ts-ignore
            return jwt.verify(token, settings.REFRESH_JWT_SECRET)


        } catch (error) {


            return expired
        }

    },

}