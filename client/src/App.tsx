import Home from "./pages/Home/Home";
import { Routes, Route, Navigate, redirect } from "react-router";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import Dashboard from "./pages/dashboard/Dashboard";
import { UseAuthContext } from "./context/AuthContext";
import handleLogout from "./utils/handleLogout";
import Navbar from "./components/Navbar";
import SettingPage from "./pages/SettingPage/SettingPage";
import useStore from "./store/store";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
function App() {
  // const { authUser } = UseAuthContext();
  const { authUser, checkAuth, isCheckingAuth } = useStore();
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
  console.log(authUser);
  return (
    <div className="h-screen p-4 flex items-center justify-center">
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
          path="/dashboard"
          element={
            !authUser ? <Navigate to={"/login"} /> : <Dashboard />
          }
        />
        <Route
          path="/setting"
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
