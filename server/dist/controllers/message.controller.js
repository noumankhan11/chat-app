import asyncHandler from "../utils/asyncHandler.js";
import Conversation from "../models/conversation.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import Message from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
//______________ Send Message____________
export const sendMessage = asyncHandler(async (req, res) => {
    const receiverId = req.params.id;
    const senderId = req.user?.id;
    const { text } = req.body;
    const image = req.file;
    // Check if input data exists
    if (!image && !text)
        return res
            .status(400)
            .json(new ApiResponse(400, "No data provided"));
    // Validate sender and receiver IDs
    if (!mongoose.isValidObjectId(senderId) ||
        !mongoose.isValidObjectId(receiverId)) {
        throw new ApiError(400, "Invalid user id");
    }
    // Upload image if provided
    let imageUrl;
    if (image) {
        try {
            const uploadResponse = await uploadOnCloudinary(image.path);
            imageUrl = uploadResponse?.secure_url;
        }
        catch (error) {
            throw new ApiError(500, "Image upload failed");
        }
    }
    // Find or create a conversation between participants
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        });
    }
    // creating a new Message
    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    });
    await newMessage.save();
    // Add the message to the conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();
    // SOCKET IO functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res
        .status(201)
        .json(new ApiResponse(201, newMessage, "Message create successfully"));
});
//_________________Get Messages_________________
export const getMessages = asyncHandler(async (req, res) => {
    const { id: userToChatId } = req.params;
    const senderId = req.user?._id;
    //validation checking
    if (!userToChatId || !senderId) {
        throw new ApiError(400, "User(sender/receiver) id is not provided");
    }
    if (!isValidObjectId(userToChatId) || !isValidObjectId(senderId)) {
        throw new ApiError(400, "Invalid user(sender/receiver) object Id");
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
