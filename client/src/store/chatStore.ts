import { create } from "zustand";
import { IUser } from "../types/types";

// Define the interface for the store's state
interface StoreState {
  selectedUser: IUser | null;
  setSelectedUser: (user: IUser | null) => void; // Accepts a user argument
}

// Create the Zustand store
export const chatStore = create<StoreState>((set) => ({
  selectedUser: null, // Initial value for selectedUser

  // Function to update the selectedUser state
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
