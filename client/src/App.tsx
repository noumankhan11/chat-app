import Home from "./pages/Home/Home";
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";

import Navbar from "./components/Navbar";
import SettingPage from "./pages/SettingPage/SettingPage";
import useStore from "./store/store";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import themeStore from "./store/themeStore";
function App() {
  // const { authUser } = UseAuthContext();
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } =
    useStore();
  console.log({ onlineUsers });
  const { theme } = themeStore();
  useEffect(() => {
    checkAuth();
  }, []);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="h-screen w-screen bg-gray-600 flex items-center justify-center text-4xl text-white">
        Loading...
      </div>
    );
  }
  return (
    <div
      data-theme={theme}
      className="h-screen p-4  flex items-center justify-center">
      <Navbar />
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={!authUser ? <Navigate to={"/login"} /> : <Home />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to={"/"} /> : <Signup />}
        />

        <Route
          path="/settings"
          element={
            !authUser ? <Navigate to={"/login"} /> : <SettingPage />
          }
        />
        <Route
          path="/profile"
          element={
            !authUser ? <Navigate to={"/login"} /> : <Profile />
          }
        />
        {/* <Route path="/logout" element={<handleLogout/>}/> */}
      </Routes>
    </div>
  );
}

export default App;
