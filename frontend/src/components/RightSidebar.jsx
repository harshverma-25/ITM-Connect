import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import API from "../services/authService";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const [users, setUsers] = useState([]);

  // ✅ Fetch real registered users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.log("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="h-full bg-white border-l border-gray-200 p-4 overflow-y-auto">

      {/* ✅ REGISTERED USERS */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Registered Users
          </h3>

          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {users.length}
          </span>
        </div>

        <div className="space-y-3">
          {users.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No users found
            </p>
          ) : (
            users.map((user) => (
              <Link
                to={`/profile/${user._id}`}
                key={user._id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <img
                  src={user.profilePic}
                  className="w-10 h-10 rounded-full border"
                  alt="profile"
                />

                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.branch} • {user.rollNumber}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* ✅ CLEAN FOOTER */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2025 ITM Connect
        </p>
      </div>
    </div>
  );
};

export default RightSidebar;
