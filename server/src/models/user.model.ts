import mongoose, { Model, Schema, model, Document } from "mongoose";

// Define the User interface
interface IUser extends Document {
  username: string;
  fullname: string;
  password: string;
  profilePic?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema(
  {
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
  },
  { timestamps: true }
);

// Create and export the User model
const User: Model<IUser> = model<IUser>("User", userSchema);

export { User, IUser };
