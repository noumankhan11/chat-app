import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../utils/ApiResponse.js";

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, fullname, password, confirmPassword, gender } =
      req.body;
    if (
      !username ||
      !fullname ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      throw new ApiError(400, "Please fill in all the fields");
    }
    // checkeing the confirm password
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }
    // checking if user already exists in the db
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new ApiError(400, "Username is not availible");
    }
    const profilePic = `https://avatar.iran.liara.run/username?username=${username}`;
    // creating a user
    const newUser = await User.create({
      username,
      fullname,
      gender,
      profilePic,
      password: await bcrypt.hash(password, 10),
    });
    if (!newUser)
      throw new ApiError(500, "Oops! something went wrong");

    return res.status(201).json(
      new ApiResponse(
        200,
        {
          username: newUser.username,
          fullname: newUser.fullname,
          gender: newUser.gender,
        },
        "User Created Successfylly!"
      )
    );
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("login route");
  }
);
export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("logout route");
  }
);
