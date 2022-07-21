import {commentsCollection} from "./db";
import {InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {CommentResponseType, CommentType} from "../types/commnet-type";
import {BloggerType} from "../types/blogger-type";
import {commentsService} from "../domain/comments-service";

const projectionComment = {
    _id: 0,
    id: "$_id",
    content: "$content",
    userId: "$userId",
    userLogin: "$userLogin",
    addedAt: "$addedAt",
}
export const commentsRepositories = {
    async commentCount(post: string): Promise<number> {
        const result: number = await commentsCollection.countDocuments({postid: post})
        return result
    },
    async createComment(comment: CommentType): Promise<CommentResponseType | null> {
        const newComment = await commentsCollection.insertOne(comment)
        if (newComment) {
            return {
                id: comment._id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                addedAt: comment.addedAt
            }
        }
        return null


    },

    async allCommentByPostIdPagination(post: string, number: number, size: number): Promise<CommentResponseType[]> {

        const comments = await commentsCollection.find({postid: post})
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .project(projectionComment)
            .toArray()


        return comments.map(d => ({
            id: d.id,
            content: d.content,
            userId: d.userId,
            userLogin: d.userLogin,
            addedAt: d.addedAt
        }))


    },
    async findCommentById(idComment: string): Promise<CommentResponseType | null> {

        const comments = await commentsCollection
            .findOne({_id: new ObjectId(idComment)}, {
                projection: projectionComment
            })

        if (comments) {
            return {
                id: comments.id,
                content: comments.content,
                userId: comments.userId,
                userLogin: comments.userLogin,
                addedAt: comments.addedAt
            }
        }
        return null


    },

    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({_id: new ObjectId(id)},
            {$set: {content: content}})

        return result.matchedCount === 1
    },
    async deleteCommentsById(id: string): Promise<boolean> {

        const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
   async deleteCommentsByPost(postid: string):Promise<boolean> {
        const result = await commentsCollection.deleteMany({postid})
        return result.deletedCount === 1
    }
}