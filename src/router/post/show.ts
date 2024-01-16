import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import { BadRequestError } from "../../../common";

const router = Router()

router.get('/post/show', async (req:Request, res:Response, next:NextFunction) => {
    const { id } = req.body;
    if (!id) {
        const allPosts = await Post.find()
        return res.status(200).send(allPosts)
    } 
    const post = await Post.findOne({ _id: id }).populate('comments')
        if (!post) {
            return next(new BadRequestError('Post not found'))
        }
    res.status(200).send(post)
})

export { router as showPostRouter }
