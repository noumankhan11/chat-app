import Home from "./pages/Home/Home";
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/dashboard/Dashboard";
import { UseAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = UseAuthContext();
  return (
    <div className="h-screen p-4 flex items-center justify-center">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
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
      </Routes>
    </div>
  );
}

export default App;
