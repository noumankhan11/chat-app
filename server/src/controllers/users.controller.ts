import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.id).select("-password");
  const allUsers = await User.find({
    _id: { $ne: user?._id },
  }).select("-password");

  res
    .status(200)
    .json(
      new ApiResponse(200, { user, allUsers }, "operation succeedded")
    );
});
