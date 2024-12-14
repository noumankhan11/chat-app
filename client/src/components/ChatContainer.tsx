import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import MessageInput from "./MessageInput";
import { chatStore } from "../store/chatStore";
import useStore from "../store/store";

export default function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
  } = chatStore();
  const { authUser } = useStore();

  // scroll to last message
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [messages]);

  // formating the Message's date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  // Get message and subscribe to messages
  useEffect(() => {
    selectedUser && getMessages();
    subscribeToMessages();
    return () => unsubscribeToMessages();
  }, [
    authUser,
    selectedUser,
    getMessages,
    subscribeToMessages,
    unsubscribeToMessages,
  ]);

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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.map((message) => (
            <div
              ref={messageEndRef}
              key={message._id}
              className={`chat ${
                message.senderId === authUser?._id
                  ? "chat-end"
                  : "chat-start"
              }`}>
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser?._id
                        ? authUser?.profilePic
                        : selectedUser?.profilePic
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div
                className={`chat-bubble py-1 px-3 ${
                  message.senderId === authUser?._id
                    ? "chat-bubble-primary"
                    : "chat-bubble-secondary"
                } flex flex-col`}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
                <div className="chat-header mb-1">
                  <time className="text-[10px] opacity-50 -ml-1 -mb-2">
                    {formatDate(message.createdAt as string)}
                  </time>
                </div>
              </div>
            </div>
          ))}
      </div>
      <MessageInput />
    </div>
  );
}
