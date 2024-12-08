// useStore.ts
import toast from "react-hot-toast";
import { Axios } from "../lib/axios";
import { create } from "zustand";

// Define the shape of your store state
interface StoreState {
  authUser: {
    fullname: string;
    profilePic: string;
    username: string;
    _id: string;
  } | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => void;
  logout: () => void;
}

// Create the store using Zustand
const useStore = create<StoreState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      const response = await Axios.get("/auth/check");

      set({ authUser: response.data.data });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
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
      toast.success("Successfully loged out");
    } catch (error) {
      console.log(error);
      toast.error("Could not logout, Please try again");
    }
  },
}));

export default useStore;
