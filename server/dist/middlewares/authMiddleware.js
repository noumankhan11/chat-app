import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const authMiddleware = asyncHandler(async function (req, res, next) {
    const token = req.cookies.token; // Ensure this matches the cookie name in your set-cookie
    const authToken = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        throw new ApiError(401, "Unauthorized | No token provided");
    }
    let decoded;
    decoded = jwt.verify(token, process.env.SECRET_KEY); // Type assertion
    if (!decoded)
        throw new ApiError(401, "Invalid token");
    // Now you can safely access userId
    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
        throw new ApiError(404, "User not found in the token");
    req.user = user;
    next();
});
