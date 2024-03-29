import { Router, Request, Response, NextFunction  } from "express";
import { User } from '../../models/user';
import { authenticationService, BadRequestError } from "../../../common";
import jwt from "jsonwebtoken";

const router = Router()

router.post('/signin',async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } =  req.body

    const user = await User.findOne({ email })
    if(!user) return next(new BadRequestError('Wrong credentials'))

    const isEqual = await authenticationService.pwdCompare(user.password, password)
    if(!isEqual) return next(new BadRequestError('Wrong credentials'))

    const token = jwt.sign({ email,  userId: user._id }, process.env.JWT_KEY!, { expiresIn: "1h" })

    req.session = { jwt: token }
    // res.status(200).send(user)
    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
        },
        token: token,
    });
})

export { router as signInRouter}