import * as dotenv from "dotenv"
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from 'cors'
import cookieSession from "cookie-session";
import { currentUser, requireAuth } from "../common";
import {
    newPostRouter,
    updatePostRouter,
    showPostRouter,
    newCommentRouter,
    deletePostRouter,

    updateCommentRouter,
    deleteCommentRouter,

    signInRouter,
    signOutRouter,
    signUpRouter,
} from './router'

const app = express();
app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200
}))
app.use(express.urlencoded({
    extended: false
}));

app.set('trust proxy', true)

app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: false
}))

app.use(currentUser )
//comments
app.use('/api' , requireAuth, newCommentRouter)
app.use('/api', requireAuth, updateCommentRouter)
app.use('/api', requireAuth, deleteCommentRouter)

//posts
app.use('/api', requireAuth, newPostRouter)
app.use('/api', requireAuth, updatePostRouter)
app.use('/api', showPostRouter)
app.use('/api', requireAuth, deletePostRouter)

app.use('/api', signInRouter)
app.use('/api', signOutRouter)
app.use('/api', signUpRouter)

declare global {
    interface CustomError extends Error {
        status?: number
    }
}

//Route not found error
app.all('*', (req, res, next) => {
    const error = new Error('The requested route does not exist') as CustomError;
    error.status = 404;
    next(error)
})

app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (error.status) {
        return res.status(error.status).json({ message: error.message})
    }
    return res.status(500).json({ message: 'Something Went Wrong' }) 
})

const start = async () => {
    if(!process.env.MONGO_URI) throw new Error('MONGO_URI is required')
    if(!process.env.JWT_KEY) throw new Error('JWT_KEY is required')

    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (err) {
        throw new Error('database connection error')
    }

    app.listen(3000, () => console.log('server is up and running on port 3000'));
}

start()
