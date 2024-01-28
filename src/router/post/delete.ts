import { Router, Request, Response, NextFunction } from 'express'
import Post from '../../models/post'
import { User, UserDoc } from "../../models/user"
import { BadRequestError } from "../../../common";

const router = Router()

router.delete('/post/delete/:id',async (req:Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    if (!id) {
        return next(new BadRequestError('Post id is required'))
    }
    try {
        await Post.findOneAndRemove({ _id: id })
    } catch (err) {
        return next(new BadRequestError('post cannot be deleted for some reason'))
    }
    const user = await User.findOneAndUpdate({ _id: req.currentUser!.userId },
        { $pull: { posts: id } }, { new: true })
    if (!user) return next(new Error())

    res.status(200).send(user)
})

export { router as deletePostRouter }