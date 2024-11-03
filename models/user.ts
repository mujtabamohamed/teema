
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, "Please provide your name"],
    },

    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: [true, "Username should be unique"],
    },

    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "Email should be unique"],
    },

    password: {
        type: String,
        required: [true, "Please provide your password"],
    },

},
{ timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model("User", userSchema);
export default User;