import { useCallback, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { chatStore } from "../../store/chatStore";
import NoChatSelected from "../../components/NoChatSelected";
import Sidebar from "../../components/Sidebar";
import ChatContainer from "../../components/ChatContainer";

const notify = () => toast("Here is your toast.");

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const { selectedUser } = chatStore();

  const baseURI = "http://localhost:3000/api";

  // __get_all messages
  const getMessages = async () => {
    setIsMessagesLoading(true);
    if (!selectedUser) return;
    try {
      const response = await fetch(
        baseURI + `/messages/${selectedUser._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error("Something went wrong! Please reload the page");
        return;
      }
      setMessages(data.data);
    } catch (error) {
      console.error("Error in fetching messages", error);
      toast.error("Something went wrong! Please reload the page");
    }
  };
  // calling getMessage inside useCallBack hook
  useCallback(() => {
    getMessages;
  }, [selectedUser]);

  return (
    <div className="h-screen w-full mx-w-[1200px] bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100  rounded-lg shadow-cl w-full max-w-7xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
