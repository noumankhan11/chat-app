import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { ObjectId } from "mongoose";
import uploadToCloudinary from "../lib/cloudinary.js";

//    registering a user
export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, fullname, password, confirmPassword } =
      req.body;
    if (!fullname || !password || !confirmPassword) {
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
    const profileImglocalFile = req.file;

    let uploadResult;
    let profilePic;
    // Check if a local file was provided, upload if present
    if (profileImglocalFile) {
      uploadResult = await uploadToCloudinary(
        profileImglocalFile.path
      );
    }
    // Use Cloudinary URL if upload was successful, else use default API URL
    profilePic =
      uploadResult?.url ||
      `https://avatar.iran.liara.run/username?username=${username}`;

    // creating a user
    const newUser = await User.create({
      username,
      fullname,
      profilePic,
      password: await bcrypt.hash(password, 10),
    });
    if (!newUser)
      throw new ApiError(
        500,
        "Oops! something went wrong, Couldn't create a user"
      );
    // generate token and send to the client using the method
    generateTokenAndSetCookie(newUser._id as ObjectId, res);
    return res.status(201).json(
      new ApiResponse(
        200,
        {
          username: newUser.username,
          fullname: newUser.fullname,
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
      throw new ApiError(400, "Invalid Username or password");

    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new ApiError(400, "Invalid Username or password");
    }

    generateTokenAndSetCookie(user.id, res);
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          username: user.username,
          fullname: user.fullname,
          prfilePic: user.profilePic,
          _id: user._id,
        },
        "Login Successfully!"
      )
    );
  }
);

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json(new ApiResponse(200, "Logout Successfully"));
};
// ______update_profilePic
export const updateProfilePic = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const profileImglocalFile = req.file;

    //
    if (!profileImglocalFile) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "New profile image is not provided")
        );
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let profilePicUrl;
    // Check if a local file was provided, upload if present

    if (profileImglocalFile) {
      try {
        const uploadResult = await uploadToCloudinary(
          profileImglocalFile.path
        );
        profilePicUrl = uploadResult?.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res
          .status(500)
          .json(new ApiResponse(500, "Image upload failed"));
      }
    }

    user.profilePic = profilePicUrl;
    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,

        "Profile image updated successfully"
      )
    );
  }
);
// updating fullName
export const updateFullname = asyncHandler(
  async (req: Request, res: Response) => {
    const { newFullname } = req.body;
    const userId = req.user?._id;

    // ignore if the user deos not provide
    if (!newFullname) {
      return res
        .status(400)
        .json(new ApiResponse(400, "New fullname is not provided"));
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.fullname = newFullname;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile updated successfully"));
  }
);

// __checkAuth_Endpoint
export const checkAuth = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user)
    return res.status(401).json(new ApiResponse(401, "Unauthorized"));
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Authorized"));
});
