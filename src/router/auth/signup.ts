import { Router, Request, Response, NextFunction  } from "express";
import { User } from '../../models/user';
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../../common";

const router = Router()

router.post('/signup',async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } =  req.body

  const user = await User.findOne({ email })

  if(user) return next(new BadRequestError('Email is already in use'))

  const newUser = User.build({
    email,
    password,
    name
  })
  await newUser.save()
  const token = jwt.sign({ email, userId: newUser._id}, process.env.JWT_KEY!, { expiresIn: "1h" })
  req.session = {
    jwt: token
  }
  // res.status(201).send(newUser)
  res.status(200).json({
    user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
    },
    token: token,
  });
})

export { router as signUpRouter}