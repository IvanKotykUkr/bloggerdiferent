import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {
    bloggerIdtValidation,
    contentValidation, inputValidationPost,
    shortDescriptionValidation,
    titleValidation,
} from "../middlewares/input-validation-midlewares-posts";
import {basicAuthorization} from "../middlewares/basicAuth";
import {commentValidation, inputValidationComment} from "../middlewares/input-validation-comments";
import {PostsResponseType, PostsResponseTypeWithPagination} from "../types/posts-type";
import {CommentResponseType, CommentsResponseTypeWithPagination} from "../types/commnet-type";
import {authMiddlewaresWithCheckOwn, authValidationMiddleware} from "../middlewares/auth-access-middlewares";


export const postsRouter = Router({})


postsRouter.get("/:id", async (req: Request, res: Response) => {
    const post: PostsResponseType | null = await postsService.findPostsById(req.params.id)
    if (!post) {
        res.sendStatus(404)
        return
    }

    res.send(post)


});

postsRouter.get("/", async (req: Request, res: Response) => {
    const pagenumber = req.query.PageNumber || 1;
    const pagesize = req.query.PageSize || 10;
    const posts: PostsResponseTypeWithPagination = await postsService.findPostsByIdBlogger(+pagenumber, +pagesize)
    res.status(200).send(posts)
});


postsRouter.post("/",

    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost,

    async (req: Request, res: Response) => {
        const newPost: PostsResponseType | null = await postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.bloggerId)
        if (newPost) {
            res.status(201).send(newPost)
            return
        }
        res.status(400).json({
            errorsMessages:
                [{
                    message: "Invalid value",
                    field: "bloggerId"
                }]
        })


    });

postsRouter.put("/:id",
    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost,

    async (req: Request, res: Response) => {
        const isUpdated: boolean | null = await postsService.updatePost(
            req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.bloggerId)


        if (isUpdated) {
            res.status(204).json(isUpdated)
            return
        }
        if (isUpdated === null) {
            res.status(400).json({
                errorsMessages:
                    [{
                        message: "Invalid value",
                        field: "bloggerId"
                    }]
            })
            return
        }
        res.send(404)


    });

postsRouter.delete("/:id", basicAuthorization, async (req: Request, res: Response) => {
    const isDeleted: boolean = await postsService.deletePost(req.params.id)

    if (isDeleted) {
        res.sendStatus(204)
        return
    }

    res.sendStatus(404)


});
postsRouter.post('/:id/comments',
    authValidationMiddleware,
    commentValidation,
    inputValidationComment,

    async (req: Request, res: Response) => {

        const newComment: CommentResponseType | null = await postsService.createCommentsByPost(req.params.id, req.body.content, "" + req.user!.id, req.user!.login)

        if (!newComment) {
            res.send(404)
            return
        }
        res.status(201).send(newComment)


    });
postsRouter.get('/:id/comments', async (req: Request, res: Response) => {
    const pagenumber = req.query.PageNumber || 1;
    const pagesize = req.query.PageSize || 10;
    const allComment: CommentsResponseTypeWithPagination | null = await postsService.sendAllCommentsByPostId(req.params.id, +pagenumber, +pagesize)
    if (!allComment) {
        res.send(404)
        return
    }
    res.status(200).send(allComment)


});




