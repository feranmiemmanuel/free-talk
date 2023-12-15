import { Request, Router, Response, NextFunction } from "express";
import Comment from "../../models/comment";
import Post from "../../models/post";

const router = Router()

router.post('/comment/new/:postId',async (req: Request, res: Response, next: NextFunction) => {
    const { userName, content } = req.body;
    const { postId } = req.params
    if (!content) {
        let error = new Error('the content field is required') as CustomError;
        error.status = 400;
        return next(error)
    }
    const newComment = new Comment({
        userName: userName ? userName : 'anonymous',
        content
    })
    await newComment.save()
    const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { newComment } },
        { new: true }
    )
    return res.status(201).send(updatedPost)
})

export { router as newCommentRouter }