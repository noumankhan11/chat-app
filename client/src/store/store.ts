// useStore.ts
import toast from "react-hot-toast";
import { Axios } from "../lib/axios";
import { create } from "zustand";
import { Socket, io } from "socket.io-client";

// Define the shape of your store state
interface StoreState {
  authUser: {
    fullname: string;
    profilePic: string;
    username: string;
    _id: string;
  } | null;

  isCheckingAuth: boolean;
  checkAuth: () => void;
  logout: () => void;
  onlineUsers: string[] | null;
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const BASE_URL = "http://localhost:3000";

// Create the store using Zustand
const useStore = create<StoreState>((set, get) => ({
  authUser: null,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      const response = await Axios.get("/auth/check");

      set({ authUser: response.data.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  logout: async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsonData = await response.json();

      jsonData.success && set({ authUser: null });
      get().disconnectSocket();
      toast.success("Successfully loged out");
    } catch (error) {
      console.log(error);
      toast.error("Could not logout, Please try again");
    }
  },
  connectSocket: () => {
    // Connect to the socket
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    // Disconnect from the socket
    if (socket && socket.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useStore;
