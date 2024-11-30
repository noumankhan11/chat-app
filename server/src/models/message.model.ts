import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Message
interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text: string;
  image: string;
}

// Define the message schema
const messageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      // Typo fixed here
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },

  { timestamps: true }
);

// Create the model
const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
