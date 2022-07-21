import {commentsRepositories} from "../repositories/comments-db-repositories";
import {CommentResponseType, CommentsResponseTypeWithPagination, CommentType} from "../types/commnet-type";
import {ObjectId} from "mongodb";


export const commentsService = {
    async convertToHex(id: string): Promise<string> {
        const hex: string =
            id.split("")
                .reduce((hex, c) => hex += c
                    .charCodeAt(0)
                    .toString(16).padStart(2, "0"), "")

        return hex
    },
    async sendAllCommentsByPostId(postId: string, pagenumber: number, pagesize: number): Promise<CommentsResponseTypeWithPagination> {

        let totalCount: number = await commentsRepositories.commentCount(postId)

        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        const items: CommentResponseType[] = await commentsRepositories.allCommentByPostIdPagination(postId, page, pageSize)
        let comment = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,
        }
        return comment
    },
    async createCommentsByPost(postid: string, content: string, userid: string, userLogin: string): Promise<CommentResponseType | null> {
        const newComment: CommentType = {
            postid: postid,
            content,
            userId: userid,
            userLogin,
            addedAt: "" + (new Date())
        }
        const generatedComment: CommentResponseType | null = await commentsRepositories.createComment(newComment)
        if (generatedComment) {
            return generatedComment
        }
        return null
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {
        return await commentsRepositories.updateCommentById(id, content)


    },
    async deleteCommentsById(id: string): Promise<boolean> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        return await commentsRepositories.deleteCommentsById(id)

    },

    async findCommentsById(id: string): Promise<CommentResponseType | null> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return null
        }

        const comment: CommentResponseType | null = await commentsRepositories.findCommentById(id)
        return comment
    },
    async deleteCommentsByPost(id: string) {
        return await commentsRepositories.deleteCommentsByPost(id)
    }
}