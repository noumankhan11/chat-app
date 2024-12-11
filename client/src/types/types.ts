// User Interface (Frontend)
export interface IUser {
  id: string; // Replace ObjectId with string
  username: string;
  fullname: string;
  profilePic?: string;
  createdAt?: string; // Dates are usually serialized as strings in JSON
  updatedAt?: string;
  _id: string;
}

// Message Interface (Frontend)
export interface IMessage {
  senderId: string; // Replace ObjectId with string
  receiverId: string;
  text: string;
  image: string;
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Conversation Interface (Frontend)
export interface IConversation {
  participants: string[]; // Array of strings instead of ObjectId[]
  messages: string[]; // Array of message IDs
  _id: string;
}
