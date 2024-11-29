import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

type AuthContextType = {
  authUser: string | null;
  setAuthUser: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [authUser, setAuthUser] = useState<string | null>(
    JSON.parse(localStorage.getItem("userInfo") || "null")
  );
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within a AuthContextProvider"
    );
  }
  return context;
};
