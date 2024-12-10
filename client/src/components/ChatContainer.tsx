import React from "react";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import MessageInput from "./MessageInput";
import { chatStore } from "../store/chatStore";

export default function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    chatStore();
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="">messages...</div>
      <MessageInput />
    </div>
  );
}
