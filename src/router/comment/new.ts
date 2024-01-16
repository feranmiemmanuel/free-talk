import { Request, Router, Response, NextFunction } from "express";
import Comment from "../../models/comment";
import Post from "../../models/post";
import { BadRequestError } from "../../../common";

const router = Router()

router.post('/comment/new/:postId',async (req: Request, res: Response, next: NextFunction) => {
    const { userName, content } = req.body;
    const { postId } = req.params
    if (!content) {
       return next(new BadRequestError('the content field is required'))
    }
    const newComment = new Comment({
        userName: userName ? userName : 'anonymous',
        content
    })
    await newComment.save()
    const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comments: newComment } },
        { new: true }
    )
    return res.status(201).send(updatedPost)
})

export { router as newCommentRouter }