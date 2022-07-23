import * as QueryString from "querystring";
import {ObjectId, WithId} from "mongodb";
export type BloggerDBType=WithId<{
    name: string,
    youtubeUrl: string,

}>
export type BloggerType = {
    _id?: ObjectId,
    name: string,
    youtubeUrl: string,
}
export type BloggerPayloadType = Omit<BloggerResponseType, 'id'>
export type BloggerResponseType = {
    id: ObjectId | undefined | string,
    name: string|undefined,
    youtubeUrl: string|undefined,
}
export type PaginationType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[],

}
export type BloggerResponseTypeWithPagination = PaginationType<BloggerResponseType>