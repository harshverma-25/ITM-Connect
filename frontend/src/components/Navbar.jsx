// components/Navbar.jsx - FINAL CLEAN VERSION
import { Link, useNavigate } from "react-router-dom";
import API from "../services/authService";
import { useEffect, useState } from "react";
import { Menu, X, Home, Plus, Trophy, User, LogOut, Search } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchMe = async () => {
    try {
      const res = await API.get("/users/me");
      setMe(res.data.data);
    } catch (e) {
      console.error("Failed to fetch user data:", e);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <>
      {/* ✅ MAIN NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ✅ LOGO */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/home")}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ITM</span>
              </div>
              <h1 className="font-bold text-xl text-gray-900 hidden sm:block">
                ITM Connect
              </h1>
            </div>

            {/* ✅ SEARCH BAR (DESKTOP) */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ITM Connect..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ✅ RIGHT SIDE (DESKTOP) */}
            <div className="hidden md:flex items-center gap-4">

              <Link to="/home" className="p-2 hover:bg-gray-100 rounded-lg">
                <Home className="w-5 h-5 text-gray-700" />
              </Link>

              <Link to="/create" className="p-2 hover:bg-gray-100 rounded-lg">
                <Plus className="w-5 h-5 text-gray-700" />
              </Link>

              <Link to="/leaderboard" className="p-2 hover:bg-gray-100 rounded-lg">
                <Trophy className="w-5 h-5 text-gray-700" />
              </Link>

              {/* ✅ PROFILE PHOTO + NAME */}
              {me && (
                <button
                  onClick={() => navigate(`/profile/${me._id}`)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <img
                    src={me.profilePic || "/default-avatar.png"}
                    className="w-9 h-9 rounded-full border"
                    alt="Profile"
                  />
                  <span className="font-medium text-gray-800">
                    {me.name?.split(" ")[0]}
                  </span>
                </button>
              )}

              {/* ✅ LOGOUT */}
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>

            {/* ✅ MOBILE MENU BUTTON */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ✅ MOBILE SEARCH */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search ITM Connect..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* ✅ MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-2">

              <Link to="/home" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
                <Home className="w-5 h-5" /> Home
              </Link>

              <Link to="/create" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
                <Plus className="w-5 h-5" /> Create
              </Link>

              <Link to="/leaderboard" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
                <Trophy className="w-5 h-5" /> Leaderboard
              </Link>

              {me && (
                <button
                  onClick={() => {
                    navigate(`/profile/${me._id}`);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg w-full"
                >
                  <User className="w-5 h-5" />
                  {me.name}
                </button>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
