import { Schema, model } from "mongoose";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    confirm_password: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    }
}, 
{timestamps: true}
)

const userModel = model('user', userSchema);

export default userModel;
