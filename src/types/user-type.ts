import {ObjectId} from "mongodb";
import {PaginationType} from "./blogger-type";
import {PostsResponseType} from "./posts-type";

export type UserType = {
    _id?: ObjectId|string,
    accountData: AccountDataType,
    emailConfirmation: EmailConfirmationType,
}
export type UserResponseType = {
    id?: ObjectId | string
    login: string,
    email?: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt?: Date
}
export type UserRoutType = {
    id?: ObjectId | string,
    login: string,

}
export type UserFromTokenType = {
    userId: string,
    iat: number,
    exp: number
}
export type UserResponseTypeWithPagination = PaginationType<UserRoutType>
export type UserAuth = {
    login: string,
    password: string
}

export type AccountDataType = {

    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt?: Date
}
export type EmailConfirmationType = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean,
}
export type RegistrationDataType = {
    ip: string
}