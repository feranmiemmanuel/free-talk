import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import { BadRequestError } from "../../../common";

const router = Router()

router.post('/post/new', async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    if (!title || !content) {
       return next(new BadRequestError('the title and content field is required'))
    }

    const newPost = new Post({
        title,
        content
    })
    await newPost.save()
    return res.status(201).send(newPost)
})

export { router as newPostRouter}