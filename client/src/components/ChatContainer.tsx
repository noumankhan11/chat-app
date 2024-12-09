import React from "react";
import ChatHeader from "./ChatHeader";

export default function ChatContainer() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
    </div>
  );
}
