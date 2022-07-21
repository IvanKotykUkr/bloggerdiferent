import {bloggersRepositories} from "../repositories/bloggers-db-repositories";
import {postsService} from "./posts-service";
import {ObjectId, WithId} from "mongodb";
import {BloggerResponseType, BloggerResponseTypeWithPagination, BloggerType} from "../types/blogger-type";
import {PostsResponseType, PostsResponseTypeWithPagination} from "../types/posts-type";


export const bloggersService = {
    async convertToHex(id: string): Promise<string> {
        const hex: string = id.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(2, "0"), "")

        return hex
    },
    getBloggers: async function (searchnameterm: string | null, pagesize: number, pagenumber: number): Promise<BloggerResponseTypeWithPagination> {
        let page: number = pagenumber
        let pageSize: number = pagesize
        let totalCountSearch: number = await bloggersRepositories.blooggersSeachCount(searchnameterm)
        let pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize)
        const itemsSearch: BloggerResponseType[] = await bloggersRepositories.getBloggersSearchTerm(pageSize, page, searchnameterm)
        return {
            pagesCount: pagesCountSearch,
            page,
            pageSize,
            totalCount: totalCountSearch,
            items: itemsSearch,
        }
    },
    async findBloggersById(id: string): Promise<BloggerResponseType | null> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return null
        }
        let blogger: BloggerResponseType | null = await bloggersRepositories.findBloggersById(id)
        if (blogger) {
            return blogger;
        }
        return null;
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerResponseType> {
        const newBlogger: BloggerType = {
            name: name,
            youtubeUrl: youtubeUrl
        }
        await bloggersRepositories.createBlogger(newBlogger)
        return {
            id: newBlogger._id,
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    },
    async updateBloggers(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        const blogger: BloggerType = {
            _id: new ObjectId(id),
            name,
            youtubeUrl
        }
        return await bloggersRepositories.updateBloggers(blogger)
    },
    async deleteBloggers(id: string): Promise<boolean> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        return await bloggersRepositories.deleteBloggers(id)
    },
    async getPostsbyIdBlogger(id: string, pagenumber: number, pageesize: number): Promise<PostsResponseTypeWithPagination | null> {

        let blogger: BloggerResponseType | null = await this.findBloggersById(id)

        if (blogger) {

            let findPosts: any = await postsService.findPostsByIdBlogger(pagenumber, pageesize, blogger.id)
            return findPosts
        }
        return null

    },
    async createPostbyBloggerId(id: string, title: string, shortDescription: string, content: string): Promise<PostsResponseType | null> {

        let newPosts: PostsResponseType | null = await postsService.createPost(title, shortDescription, content, id)
        if (newPosts) {

            return newPosts
        }
        return null


    }
}
