import { create } from "zustand";
import { IMessage, IUser } from "../types/types";
import toast from "react-hot-toast";
import useStore from "./store";

// Define the interface for the store's state
interface StoreState {
  selectedUser: IUser | null;
  messages: IMessage[] | null;
  isMessagesLoading: boolean;
  getMessages: () => void;
  setSelectedUser: (user: IUser | null) => void; // Accepts a user argument
  sendMessage: (formData: FormData) => void;
  subscribeToMessages: () => void;
  unsubscribeToMessages: () => void;
}

// Create the Zustand store
export const chatStore = create<StoreState>((set, get) => ({
  selectedUser: localStorage.getItem("selectedUser")
    ? (JSON.parse(localStorage.getItem("selectedUser")!) as IUser)
    : null,

  messages: null,
  isMessagesLoading: false,
  // Function to update the selectedUser state
  setSelectedUser: (user) => {
    set({ selectedUser: user });
    localStorage.setItem("selectedUser", JSON.stringify(user));
  },
  // Get messages form api

  getMessages: async () => {
    set({ isMessagesLoading: true });
    const { selectedUser } = get();
    if (!selectedUser) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/${selectedUser._id}`,
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
      set({ messages: data.data });
    } catch (error) {
      console.error("Error in fetching messages", error);
      toast.error("Something went wrong! Please reload the page");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (formData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/send/${selectedUser._id}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      const jsonResponse = await response.json();

      if (!jsonResponse.success) {
        toast.error("Failed to send the message, please try again!");
        return;
      }
      set((state) => ({
        messages: state.messages
          ? [...state.messages, jsonResponse.data]
          : [jsonResponse.data],
      }));
    } catch (error) {
      console.log(error);
      toast.error("Failed to send the message, please try again!");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useStore.getState().socket;
    socket?.on("newMessage", (newMessage: IMessage) => {
      set((state) => ({
        messages: state.messages
          ? [...state.messages, newMessage]
          : [newMessage],
      }));
      // set({messages:[...get().messages || [],newMessage]})
    });
  },
  unsubscribeToMessages: () => {
    const socket = useStore.getState().socket;
    socket?.off("newMessage");
  },
}));
