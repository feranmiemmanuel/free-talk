import { Router, Request, Response, NextFunction } from 'express'
import Post from '../../models/post'
import { BadRequestError, uploadImages } from "../../../common";
import fs from 'fs'
import path from 'path'

const router = Router()

router.post('/post/:id/add/images', uploadImages, async (req: Request, res: Response, next: NextFunction ) => {
    const { id } = req.params

    if (!req.files) return next(new BadRequestError('images are required'))
    let images: Array<Express.Multer.File>
    if (typeof req.files == 'object') {
        images = Object.values(req.files)
    } else {
        images = req.files ? [...req.files] : []
    }

    const imagesArray = images.map((file: Express.Multer.File) => {
        let srcObject = { src: `data: ${file.mimetype};base64,${fs.readFileSync(path.join('uploads/' + file.filename)).toString('base64')}`}

        fs.unlink(path.join('uploads/' + file.filename), () => {})
        return srcObject
    }) 

    const post = await Post.findOneAndUpdate({ _id: id }, {
        $push: { images: { $each: imagesArray } } }, { new: true })

    res.status(200).send(post)
})

export { router as addImagesRouter }