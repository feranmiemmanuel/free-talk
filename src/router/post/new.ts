import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import { User } from "../../models/user"
import { BadRequestError, uploadImages } from "../../../common";
import fs from 'fs'
import path from 'path'

const router = Router()

router.post('/post/new', uploadImages, async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;

    if (!req.files) return next(new BadRequestError('images are required'))

    let images: Array<Express.Multer.File>

    if (typeof req.files == 'object') {
        images = Object.values(req.files)
    } else {
        images = req.files ? [...req.files] : []
    }

    if (!title || !content) {
       return next(new BadRequestError('the title and content field is required'))
    }

    const newPost = Post.build({
        title,
        content,
        images: images.map((file: Express.Multer.File) => {
            // let srcObject = { src: `data: ${file.mimetype};base64,${file.buffer.toString('base64')}`}
            let srcObject = { src: `data: ${file.mimetype};base64,${fs.readFileSync(path.join('uploads/' + file.filename)).toString('base64')}`}

            fs.unlink(path.join('uploads/' + file.filename), () => {})
            return srcObject
        })
    })
    await newPost.save()
    await User.findOneAndUpdate({ _id: req.currentUser!.userId },
                {$push:{ posts: newPost._id }})
    return res.status(201).send(newPost)
})

export { router as newPostRouter}