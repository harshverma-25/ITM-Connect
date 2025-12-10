// pages/Leaderboard.jsx - FIXED
import { useEffect, useState } from "react";
import API from "../services/authService";
import MainLayout from "../layouts/MainLayout";
import { Trophy, Award, TrendingUp, Crown } from "lucide-react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/leaderboard");
        setUsers(res.data.data || []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return "from-yellow-400 to-yellow-600";
      case 2: return "from-gray-400 to-gray-600";
      case 3: return "from-amber-700 to-amber-900";
      default: return "from-blue-500 to-blue-700";
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-700" />;
      default: return <span className="text-sm font-medium text-gray-500">{rank}</span>;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leaderboard</h1>
              <p className="text-gray-600 mt-2">Top contributors in ITM Connect</p>
            </div>
            <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Updated Daily</span>
            </div>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Participants</p>
                <p className="text-3xl font-bold mt-2">{users.length}</p>
              </div>
              <Trophy className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Likes Given</p>
                <p className="text-3xl font-bold mt-2">
                  {users.reduce((sum, user) => sum + (user.totalLikes || 0), 0)}
                </p>
              </div>
              <Award className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active This Month</p>
                <p className="text-3xl font-bold mt-2">{users.filter(u => u.isActive).length}</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 bg-gray-50">
            <div className="col-span-1 text-sm font-medium text-gray-700">Rank</div>
            <div className="col-span-5 text-sm font-medium text-gray-700">Student</div>
            <div className="col-span-3 text-sm font-medium text-gray-700">Branch</div>
            <div className="col-span-3 text-sm font-medium text-gray-700 text-right">Total Likes</div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No data yet</h3>
              <p className="text-gray-600">Be the first to make a post!</p>
            </div>
          ) : (
            /* Leaderboard Rows */
            <div className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <div 
                  key={user._id} 
                  className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Rank */}
                  <div className="col-span-1">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(index + 1)} flex items-center justify-center`}>
                      {getRankIcon(index + 1)}
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="col-span-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.rollNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="col-span-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.branch || "IT"} Student
                    </span>
                  </div>

                  {/* Likes */}
                  <div className="col-span-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-xl font-bold text-gray-900">{user.totalLikes || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"></div>
              <span>Rank is based on total likes received on posts</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full"></div>
              <span>All active ITM students are included</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-green-700 rounded-full"></div>
              <span>Leaderboard updates daily at midnight</span>
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default Leaderboard;