import { Schema, model } from "mongoose";
// Define the User schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
}, { timestamps: true });
// Create and export the User model
const User = model("User", userSchema);
export { User };
