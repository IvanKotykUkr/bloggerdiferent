import {bloggerCollection} from "./db";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {BloggerResponseType, BloggerType} from "../types/blogger-type";

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
        return await bloggerCollection.countDocuments(filter)

    },

    async getBloggersSearchTerm(size: number, number: number, name: string | null): Promise<BloggerResponseType[]> {
        const filter = await this.paginationFilter(name)

        const bloggers = await bloggerCollection.find(filter)
            .skip((number - 1) * size)
            .limit(size)
            .project(projectionBlogger)
            .toArray()

        return bloggers.map(d => ({id: d.id, name: d.name, youtubeUrl: d.youtubeUrl}))
    },


    async findBloggersById(id: string): Promise<BloggerResponseType | null> {

        const blogger = await bloggerCollection.findOne({_id: new ObjectId(id)},
            {
                projection: projectionBlogger
            })
        if (blogger) {
            return {id: blogger.id, name: blogger.name, youtubeUrl: blogger.youtubeUrl}
        }
        return null;
    },


    async createBlogger(newBlogger: BloggerType): Promise<InsertOneResult<BloggerType>> {


        const result: InsertOneResult<BloggerType> = await bloggerCollection.insertOne(newBlogger)

        return result

    },
    async updateBloggers(blogger: BloggerType): Promise<boolean> {

        const result = await bloggerCollection.updateOne({_id: new ObjectId(blogger._id)}, {
            $set: {
                name: blogger.name,
                youtubeUrl: blogger.youtubeUrl
            }
        })


        return result.matchedCount === 1

    },
    async deleteBloggers(id: string): Promise<boolean> {

        const result = await bloggerCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },


}
