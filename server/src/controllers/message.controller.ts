import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Conversation from "../models/conversation.model.js";
import mongoose, { ObjectId, isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import Message from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../lib/cloudinary.js";

//______________ Send Message____________
export const sendMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const receiverId = req.params.id;
    const senderId = req.user?.id;
    const { message, image } = req.body;

    let imageUrl;
    if (image) {
      const uploadResponse = await uploadOnCloudinary(image);
      imageUrl = uploadResponse?.secure_url;
    }

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
      image: imageUrl,
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
//_________________Get Messages_________________
export const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const senderId = req.user?._id;

  //validation checking
  if (!userToChatId || !senderId) {
    throw new ApiError(
      400,
      "User(sender/receiver) id is not provided"
    );
  }
  if (!isValidObjectId(userToChatId) || !isValidObjectId(senderId)) {
    throw new ApiError(
      400,
      "Invalid user(sender/receiver) object Id"
    );
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, userToChatId] },
  }).populate("messages");
  if (!conversation) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No messages yet!"));
  }
  const messages = conversation.messages;

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Operarion succeeded"));
});
