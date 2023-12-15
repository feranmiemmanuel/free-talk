import { Request, Router, Response, NextFunction } from "express";
import Comment from "../../models/comment";

const router = Router()

router.post('/comment/:id',async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { content } = req.body
    if (!id) {
        const commentError = new Error('Comment id is required') as CustomError
        commentError.status = 400;
        next(commentError)
    }
    if (!content) {
        const contentError = new Error('content field is required') as CustomError
        contentError.status = 400;
        next(contentError)
    }
    let updatedComment;
    try {
        updatedComment = await Comment.findOneAndUpdate(
            { _id: id},
            { content: content}
        )
    } catch (err) {
        const updateError = new Error('Error updating comment') as CustomError
        updateError.status = 400
        next(updateError)
    }
    res.status(200).send(updatedComment)
})

export { router as updateCommentRouter}