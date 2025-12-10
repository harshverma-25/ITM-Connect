// pages/Profile.jsx - COMPACT with delete button
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/authService";
import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard";
import { Calendar, Mail, Edit2, ImageIcon, Award } from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  // ✅ Fetch Profile (SELF) - Same logic
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  // ✅ Fetch User Posts - Same logic
  const fetchPosts = async () => {
    try {
      const res = await API.get(`/posts/user/${user?._id || id}`);
      if (res.data.success) {
        setPosts(res.data.data || []);
      }
    } catch (error) {
      console.error("User posts error:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user?._id || id) {
      fetchPosts();
    }
  }, [user, id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">User not found</h2>
            <p className="text-sm text-gray-600 mt-1 mb-4">This profile doesn't exist.</p>
            <Link
              to="/home"
              className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* ✅ PROFILE HEADER - More compact */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-3 border-white shadow-md overflow-hidden bg-gray-100">
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                        {user.branch} Student
                      </span>
                      <span className="text-sm text-gray-600">{user.rollNumber}</span>
                    </div>
                  </div>
                  
                  {/* ✅ EDIT PROFILE BUTTON - More compact */}
                  <Link
                    to="/edit-profile"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Profile
                  </Link>
                </div>

                {/* Stats Grid - More compact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-xs text-gray-500">Roll Number</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{user.rollNumber}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-xs text-gray-500">Branch</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{user.branch}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <p className="text-xs text-gray-500">Batch</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">20{user.year}</p>
                  </div>
                </div>

                {/* Posts & Likes Stats - More compact */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <ImageIcon className="w-4 h-4 text-gray-600" />
                      <p className="text-xl font-bold text-gray-900">{posts.length}</p>
                    </div>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Award className="w-4 h-4 text-gray-600" />
                      <p className="text-xl font-bold text-gray-900">{user.totalLikes || 0}</p>
                    </div>
                    <p className="text-xs text-gray-500">Total Likes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ TABS - More compact */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 py-3 text-center font-medium transition-colors relative text-sm ${
                  activeTab === "posts"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Posts
                {activeTab === "posts" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab("about")}
                className={`flex-1 py-3 text-center font-medium transition-colors relative text-sm ${
                  activeTab === "about"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                About
                {activeTab === "about" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </nav>
          </div>

          {/* ✅ CONTENT - More compact */}
          <div className="p-4">
            {activeTab === "posts" ? (
              posts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No posts yet</h3>
                  <p className="text-sm text-gray-600 mb-4">Share your first post!</p>
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Post
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts.map((post) => (
                    <div key={post._id} className="relative">
                      <PostCard
                        post={post}
                        currentUserId={user._id}
                        refreshFeed={fetchPosts}
                      />
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-3">About</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-medium text-gray-900 text-sm">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600">Joined</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {new Date(user.createdAt).toDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ DELETE ACCOUNT BUTTON - Added */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                // Add your delete account logic here
                alert("Account deletion feature coming soon!");
              }
            }}
            className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 border border-red-200 hover:border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;