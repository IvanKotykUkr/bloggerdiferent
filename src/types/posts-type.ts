import {PaginationType} from "./blogger-type";
import {ObjectId} from "mongodb";

export type PostsType = {

    _id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string
}
export type PostsResponseType = {
    id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string
}
export type PostsResponseTypeWithPagination = PaginationType<PostsResponseType>;
