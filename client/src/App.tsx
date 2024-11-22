import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Siginup";
function App() {
  return (
    <div className="h-screen p-4 flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
