import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import { Types } from "mongoose";

const router = Router()

router.get('api/post/show',async (req:Request, res:Response, next:NextFunction) => {
    const { id } = req.body;
    let post:any = Post;
    if (!id) {
        const allPosts = await post.find()
        return res.status(200).send(allPosts)
    } 
    post = await post.findOne({ _id: id }).populate('comments')
        if (!post) {
            const error = new Error('Post not found') as CustomError
            error.status = 400
            next(error)
        }
    res.status(200).send(post)
})

export { router as showPostRouter }
