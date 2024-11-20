import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Conversation from "../models/conversation.model.js";
import mongoose, { ObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import Message from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const sendMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const receiverId = req.params.id;
    const senderId = req.user?.id;
    const message = req.body.message;

    if (
      !mongoose.isValidObjectId(senderId) ||
      !mongoose.isValidObjectId(receiverId)
    ) {
      throw new ApiError(400, "Invalid user id");
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    // creating Message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    await newMessage.save();
    // adding message to conversation
    await conversation.updateOne({
      $push: { messages: newMessage._id },
    });
    // SOCKET IO functionality here..
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newMessage,
          "Message create successfully"
        )
      );
  }
);
