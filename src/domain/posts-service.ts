import {postsRepositories} from "../repositories/posts-db-repositories";
import {bloggersService} from "./bloggers-service";
import {commentsService} from "./comments-service";

import {ObjectId} from "mongodb";
import {PostsResponseType, PostsResponseTypeWithPagination, PostsType} from "../types/posts-type";
import {BloggerResponseType} from "../types/blogger-type";
import {CommentResponseType, CommentsResponseTypeWithPagination} from "../types/commnet-type";

export const postsService = {
    async convertToHex(id: string): Promise<string> {
        const hex: string = id.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(2, "0"), "")

        return hex
    },

    async findPostsByIdBlogger(pagenumber: number, pagesize: number, bloggerId?: ObjectId | undefined | string): Promise<PostsResponseTypeWithPagination> {


        let totalCount: number = await postsRepositories.findPostsByIdBloggerCount(bloggerId)
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)

        const items: PostsResponseType[] = await postsRepositories.findPostsByIdBloggerPagination(bloggerId, page, pageSize)
        let post = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,

        }
        return post
    },
    async findPostsById(id: string): Promise<PostsResponseType | null> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return null
        }
        const post: PostsResponseType | null = await postsRepositories.findPostsById(id)

        if (post) {
            return post;
        }
        return null;


    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostsResponseType | null> {
        const blogger: BloggerResponseType | null = await bloggersService.findBloggersById(bloggerId)
        if (blogger) {
            const newpost: PostsType | null = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: new ObjectId(bloggerId),
                bloggerName: blogger.name,
            }
            await postsRepositories.createPost(newpost)
            return {
                id: newpost._id,
                title: newpost.title,
                shortDescription: newpost.shortDescription,
                content: newpost.content,
                bloggerId: newpost.bloggerId,
                bloggerName: newpost.bloggerName
            }
        }
        return null
    },

    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     bloggerId: string): Promise<boolean | null> {
        const idHex = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }

        let blogger: BloggerResponseType | null = await bloggersService.findBloggersById(bloggerId)

        let upPost: PostsResponseType | null = await postsService.findPostsById(id)

        if (upPost) {
            if (blogger) {
                return await postsRepositories.updatePost(id, title, shortDescription, content, bloggerId, blogger.name)
            }
            return null
        }
        return false

    },


    async deletePost(id: string): Promise<boolean> {
        const idHex = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        const isDeleted = await postsRepositories.deletePost(id)
        if(isDeleted){
            return await commentsService.deleteCommentsByPost(id)
        }
        return false


    },


    async createCommentsByPost(postid: string, content: string, userid: string, userLogin: string): Promise<CommentResponseType | null> {
        let post: PostsType | null = await this.findPostsById(postid)
        if (post) {
            let newComment: CommentResponseType | null = await commentsService.createCommentsByPost(postid, content, userid, userLogin)
            return newComment
        }
        return null

    },
    async sendAllCommentsByPostId(postid: string, pagenumber: number, pagesize: number): Promise<CommentsResponseTypeWithPagination | null> {
        let post: PostsResponseType | null = await this.findPostsById(postid)

        if (post) {
            let allComments: CommentsResponseTypeWithPagination = await commentsService.sendAllCommentsByPostId(postid, pagenumber, pagesize)
            return allComments
        }
        return null


    },

}