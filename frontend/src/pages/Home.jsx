// pages/Home.jsx - MORE COMPACT
import { useEffect, useState } from "react";
import API from "../services/authService";
import MainLayout from "../layouts/MainLayout";
import CreatePostCard from "../components/CreatePostCard";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("user_id");

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts/feed");
      if (res.data.success) {
        setPosts(res.data.data || []);
      }
    } catch (error) {
      console.log("Feed load failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <MainLayout>
      {/* Header Section - More compact */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">ITM Connect</h1>
            <p className="text-sm text-gray-600 mt-1">Share, connect and grow</p>
          </div>
          <button 
            onClick={fetchFeed}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Create Post Section */}
      <CreatePostCard refreshFeed={fetchFeed} />

      {/* Loading State - Compact */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-sm text-gray-600">Loading feed...</p>
        </div>
      )}

      {/* Empty State - Compact */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No posts yet</h3>
          <p className="text-sm text-gray-600 mb-3">Be the first to share!</p>
          <button 
            onClick={fetchFeed}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Check again
          </button>
        </div>
      )}

      {/* Posts Grid - Compact layout */}
      {!loading && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              refreshFeed={fetchFeed}
            />
          ))}
        </div>
      )}

      {/* End of Feed - Compact */}
      {!loading && posts.length > 0 && (
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <div className="w-16 h-px bg-gray-300"></div>
            <span>You're all caught up</span>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Home;