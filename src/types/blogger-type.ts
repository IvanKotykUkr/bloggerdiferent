import * as QueryString from "querystring";
import {ObjectId} from "mongodb";

export type BloggerType = {
    _id?: ObjectId,
    name: string,
    youtubeUrl: string,
}
export type BloggerPayloadType = Omit<BloggerResponseType, 'id'>
export type BloggerResponseType = {
    id: ObjectId | undefined | string,
    name: string,
    youtubeUrl: string,
}
export type PaginationType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[],

}
export type BloggerResponseTypeWithPagination = PaginationType<BloggerResponseType>