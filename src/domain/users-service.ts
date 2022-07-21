import {userRepositories} from "../repositories/user-db-repositories";
import {UserResponseType, UserResponseTypeWithPagination, UserRoutType, UserType} from "../types/user-type";
import * as bcrypt from "bcrypt";
import {authService} from "./auth-service";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {ObjectId} from "mongodb";


export const usersService = {
    async convertToHex(id: string): Promise<string> {

        const hex = id.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(2, "0"), "")

        return hex

    },


    async findUserById(userid: string): Promise<UserResponseType | null> {

        const idHex: string = await this.convertToHex(userid)

        if (idHex.length !== 48) {
            return null
        }


        return await userRepositories.findUserById(userid)

    },

    async getAllUsers(pagenumber: number, pagesize: number): Promise<UserResponseTypeWithPagination> {
        let totalCount: number = await userRepositories.countUsers()
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        const items: UserRoutType[] = await userRepositories.getAllUsersPagination(pagenumber, pagesize)
        const users = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
        return users
    },
    async deleteUser(id: string): Promise<boolean> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        return await userRepositories.deleteUserById(id)

    },

    async createUserByUser(login: string, email: string, password: string, ip: string): Promise<UserRoutType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await authService.generateHash(password, passwordSalt)

        const newUser: UserType = {
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),
                    {
                        hours: 1,
                        minutes: 2

                    }),
                isConfirmed: false

            }

        }
        const generatedUser: any = await userRepositories.createUser(newUser)

        if (generatedUser) {

            return {id: generatedUser.insertedId, login: newUser.accountData.login}
        }

        return null

    }
}