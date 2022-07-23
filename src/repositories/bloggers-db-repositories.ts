import {BloggerModelClass} from "./db";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {BloggerDBType, BloggerResponseType, BloggerType} from "../types/blogger-type";

const projectionBlogger = {
    _id: 0,
    id: "$_id",
    name: "$name",
    youtubeUrl: "$youtubeUrl",
}

export const bloggersRepositories = {
    async paginationFilter(name: string | null) {
        let filter = {}

        if (name) {
            return filter = {name: {$regex: name}}
        }
        return filter
    },
    async blooggersSeachCount(name: string | null): Promise<number> {
        const filter = await this.paginationFilter(name)
        return BloggerModelClass.countDocuments(filter)

    },

    async getBloggersSearchTerm(size: number, number: number, name: string | null): Promise<BloggerResponseType[]> {
        const filter = await this.paginationFilter(name)

        const bloggers = await BloggerModelClass.find(filter)
            .skip((number - 1) * size)
            .limit(size)
            .lean()


        return bloggers.map(d => ({id: d._id, name: d.name, youtubeUrl: d.youtubeUrl}))
    },


    async findBloggersById(id: ObjectId): Promise<BloggerResponseType | null> {
        const blogger = await BloggerModelClass.findById(id);

        if (blogger) {

            return {id: blogger.id, name: blogger.name, youtubeUrl: blogger.youtubeUrl}
        }
        return null;
    },


    async createBlogger(newBlogger: BloggerType): Promise<BloggerResponseType> {
        const bloggerInstance = new BloggerModelClass()
        bloggerInstance._id = new ObjectId()
        bloggerInstance.name = newBlogger.name
        bloggerInstance.youtubeUrl = newBlogger.youtubeUrl
        await bloggerInstance.save()

        //sconst result = await BloggerModelClass.create(newBlogger)

        return {id: bloggerInstance._id, name: bloggerInstance.name, youtubeUrl: bloggerInstance.youtubeUrl}

    },
    async updateBloggers(blogger: BloggerType): Promise<boolean> {
        const bloggerInstance = await BloggerModelClass.findById(blogger._id)
        if (!bloggerInstance) return false

        bloggerInstance.name = blogger.name
        bloggerInstance.youtubeUrl = blogger.youtubeUrl
        await bloggerInstance.save()

        //    const result = await BloggerModelClass.updateOne({_id: new ObjectId(blogger._id)}, {
        //  name: blogger.name,
        //   youtubeUrl: blogger.youtubeUrl

        //})


        return true

    },
    async deleteBloggers(id: string): Promise<boolean> {
        const bloggerInstance = await BloggerModelClass.findById(id)
        if (!bloggerInstance) return false

        await bloggerInstance.deleteOne()

      //  const result = await BloggerModelClass.deleteOne({_id: new ObjectId(id)})
        //return result.deletedCount === 1
        return true
    },


}
