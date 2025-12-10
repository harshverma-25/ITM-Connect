import { Home, User, PlusCircle, Trophy, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/authService";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ FETCH REAL LOGGED-IN USER
  const fetchMe = async () => {
    try {
      const res = await API.get("/users/me");
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.log("Failed to load user");
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: User, label: "Profile", path: "/profile/me" },
    { icon: PlusCircle, label: "Create", path: "/create" },
    { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200 p-4 flex flex-col">

      {/* ✅ REAL USER PROFILE */}
      {user && (
        <div className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.profilePic}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                alt="Profile"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {user.name}
              </h3>
              <p className="text-sm text-gray-600">
                {user.rollNumber}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MENU */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
          >
            <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* ✅ LOGOUT */}
      <div className="pt-4 mt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
          <span className="font-medium">Logout</span>
        </button>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            ITM Connect © 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
