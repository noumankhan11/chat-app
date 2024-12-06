// useStore.ts
import { Axios } from "../lib/axios";
import { create } from "zustand";

// Define the shape of your store state
interface StoreState {
  authUser: {} | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => void;
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
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));

export default useStore;
