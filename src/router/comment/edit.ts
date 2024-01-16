import { Request, Router, Response, NextFunction } from "express";
import Comment from "../../models/comment";
import { BadRequestError } from "../../../common";

const router = Router()

router.post('/comment/:id',async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { content } = req.body
    if (!id) {
        return next(new BadRequestError('Comment id is required'))
    }
    if (!content) {
        return next(new BadRequestError('content field is required'))
    }
    let updatedComment;
    try {
        updatedComment = await Comment.findOneAndUpdate(
            { _id: id},
            { content: content}
        )
    } catch (err) {
        return next(new BadRequestError('Error updating comment'))
    }
    res.status(200).send(updatedComment)
})

export { router as updateCommentRouter}