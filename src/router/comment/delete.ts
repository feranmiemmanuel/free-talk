import { Request, Router, Response, NextFunction } from "express";
import Comment from "../../models/comment";
import Post from "../../models/post";
import { BadRequestError } from "../../../common";

const router = Router()

router.delete('/comment/:commentId/delete/:postId',async (req :Request, res: Response, next: NextFunction) => {
    const { postId, commentId} = req.params
    if (!postId || !commentId) {
        return next(new BadRequestError('Post id and comment id field is required'))
    }
    try {
        await Comment.findOneAndRemove({ _id: commentId })
    } catch (err) {
        next(new Error('Error deleting comment') as CustomError)
    }
    const post  = await Post.findOneAndUpdate(
        { _id: postId},
        { $pull: { comments: commentId } },
        { new: true }
    )
    if (!post) return next(new Error())
    res.status(200).send(post)
})

export { router as deleteCommentRouter }
