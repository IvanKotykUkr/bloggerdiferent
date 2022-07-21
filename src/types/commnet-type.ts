import {ObjectId} from "mongodb";
import {BloggerResponseType, PaginationType} from "./blogger-type";

export type CommentType = {
    _id?: ObjectId,
    postid?: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: string
}

export type CommentResponseType = {
    id?: ObjectId | string,
    postid?: ObjectId | string,
    content: string,
    userId: ObjectId | string | undefined,
    userLogin: string,
    addedAt: string
}
export type CommentsResponseTypeWithPagination = PaginationType<CommentResponseType>