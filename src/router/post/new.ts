import { Router, Response, NextFunction } from "express";

const router = Router()

router.post('api/post/new', async (req: Request, res: Response, next: NextFunction) => {
    
})

export { router as newPostRouter}