import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { ObjectId } from "mongoose";

//    registering a user
export const register = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("register.. the data: ", req.body);
    const { username, fullname, password, confirmPassword, gender } =
      req.body;
    console.log("register api data:", req.body);
    if (!fullname || !password || !confirmPassword || !gender) {
      throw new ApiError(400, "Please fill in all the fields");
    }
    // checkeing the confirm password
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords not matched");
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
      throw new ApiError(
        500,
        "Oops! something went wrong, Couldn't create a user"
      );

    generateTokenAndSetCookie(newUser._id as ObjectId, res);
    return res.status(201).json(
      new ApiResponse(
        200,
        {
          username: newUser.username,
          fullname: newUser.fullname,
          gender: newUser.gender,
        },
        "User Created Successfully!"
      )
    );
  }
);

//   login a user
export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user)
      throw new ApiError(400, "User doesn't exist in the DB");

    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new ApiError(
        400,
        "Invalid credentials | Invalid password or Username"
      );
    }

    generateTokenAndSetCookie(user.id, res);
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          username: user.username,
          fullname: user.fullname,
          gender: user.gender,
        },
        "Login Successfully!"
      )
    );
  }
);

export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json(new ApiResponse(200, "Logout Successfully"));
};
