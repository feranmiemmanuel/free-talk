import { Request, Response, Router, NextFunction } from "express";
import Post from "../../models/post";

const router = Router();

router.post('/post/update/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { title, content } = req.body
    if (!id) {
        const error = new Error('Post id is required') as CustomError
        error.status = 400;
        next(error)
    } 
    let updatedPost;
    try {
        updatedPost = await Post.findOneAndUpdate(
            { _id: id },
            { $set: {content, title} },
            { new: true }
        )
    } catch (err) {
        const error = new Error('Post Cannot be Updated') as CustomError
        error.status = 400
        next(error)
    }
    res.status(200).send(updatedPost)
})
export { router as updatePostRouter }
