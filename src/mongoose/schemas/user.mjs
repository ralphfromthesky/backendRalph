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
    },
    fullname: {type: String},
    age: {type: Number},
    address: {type: String},
    contanct: {type: String},
    emailAddress: {type: String}

})

export const Users  = mongoose.model('user', userSchema)