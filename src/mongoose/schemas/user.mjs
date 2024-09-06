import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    }
})

export const Users  = mongoose.model('user', userSchema)