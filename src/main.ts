import * as dotenv from "dotenv"
dotenv.config();

import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());

const start = async () => {
    if(!process.env.MONGO_URI) throw new Error('MONGO_URI is required')

    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (err) {
        throw new Error('database connection error')
    }

    app.listen(8080, () => console.log('server is up and running on port 8080'));
}

start()
