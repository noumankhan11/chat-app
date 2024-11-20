import { NextFunction, Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string; // Or ObjectId, depending on how you manage user IDs
  iat?: number; // Optional (issued at)
  exp?: number; // Optional (expiration)
}

export const authMiddleware = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token; // Ensure this matches the cookie name in your set-cookie
  if (!token) {
    throw new ApiError(401, "Unauthorized | No token provided");
  }

  let decoded: DecodedToken;

  decoded = jwt.verify(
    token,
    process.env.SECRET_KEY as string
  ) as DecodedToken; // Type assertion

  if (!decoded) throw new ApiError(401, "Invalid token");

  // Now you can safely access userId
  const user = await User.findById(decoded.userId).select(
    "-password"
  );
  if (!user) throw new ApiError(404, "User not found in the token");
  req.user = user;

  next();
});
