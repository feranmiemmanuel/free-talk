import mongoose from "mongoose";
import { authenticationService } from "../../common";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true 
    },
    posts: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Post"
        }
    ]
})
userSchema.pre("save",async function(done) {
    if (this.isModified('password') || this.isNew) {
        const hashedPassword = authenticationService.pwdToHash(this.get('password'))
        this.set('password', 'hashed')
    }
    done()
})

export const User = mongoose.model('User', userSchema)