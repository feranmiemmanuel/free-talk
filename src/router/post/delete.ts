import { Router, Request, Response, NextFunction } from 'express'
import Post from '../../models/post'

const router = Router()

router.delete('/api/post/delete/:id',async (req:Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    if (!id) {
        const error = new Error('Post id is required') as CustomError
        error.status = 400
        next(error)
    }
    try {
        await Post.findOneAndRemove({ _id: id })
    } catch (err) {
        next(new Error('post cannot be deleted for some reason'))
    }

    res.status(200).json({ success: true, message: 'post deleted successfully'})
})

export { router as deletePost }