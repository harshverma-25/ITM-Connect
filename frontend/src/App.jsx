import { BrowserRouter, Routes, Route } from "react-router-dom";
import RollVerify from "./pages/RollVerify";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AppLayout from "./components/AppLayout";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* ✅ PUBLIC ROUTES (NO NAVBAR) */}
      <Route path="/" element={<RollVerify />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ PROTECTED ROUTES WITH NAVBAR */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
