import { create } from "zustand";

interface storeState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const themeStore = create<storeState>((set) => ({
  theme: localStorage.getItem("theme") || "dark",
  setTheme: (theme: string) => {
    localStorage.setItem("theme", theme);
    set({ theme: theme });
  },
}));

export default themeStore;
