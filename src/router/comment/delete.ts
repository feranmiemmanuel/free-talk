import { Request, Router, Response, NextFunction } from "express";
import Comment from "../../models/comment";
import Post from "../../models/post";

const router = Router()

router.delete('/comment/:commentId/delete/:postId',async (req :Request, res: Response, next: NextFunction) => {
    const { postId, commentId} = req.params
    if (!postId || !commentId) {
        const error = new Error('Post id and comment id field is required') as CustomError
        error.status = 400
        next(error)
    }
    try {
        await Comment.findOneAndRemove({ _id: commentId })
    } catch (err) {
        next(new Error('Error deleting comment'))
    }
    await Post.findOneAndUpdate(
        { _id: postId},
        { $pull: { comments: commentId }}
    )
    res.status(200).json({success: true})
})

export { router as deleteCommentRouter }
