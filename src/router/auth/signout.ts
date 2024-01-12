import { Router, Request, Response, NextFunction  } from "express";
import { User } from '../../models/user';
import { authenticationService } from "../../../common";
import jwt from "jsonwebtoken";

const router = Router()

router.post('/signout',async (req: Request, res: Response, next: NextFunction) => {
    req.session = null
    res.send({})
})

export { router as signOutRouter}