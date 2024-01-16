import { Router, Request, Response, NextFunction  } from "express";
import { User } from '../../models/user';
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../../common";

const router = Router()

router.post('/signup',async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } =  req.body

  const user = await User.findOne({ email })

  if(user) return next(new BadRequestError('Email is already in use'))

  const newUser = new User({
    email,
    password,
    name
  })
  await newUser.save()
  req.session = {
    jwt: jwt.sign({ email, userId: newUser._id}, process.env.JWT_KEY!, { expiresIn: "1h" })
  }
  res.status(201).send(newUser)
})

export { router as signUpRouter}