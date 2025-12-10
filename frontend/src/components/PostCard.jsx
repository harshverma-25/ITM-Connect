// components/PostCard.jsx - MORE COMPACT with fixed image size
import { useState } from "react";
import API from "../services/authService";

const PostCard = ({ post, currentUserId, refreshFeed }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = post.user._id === currentUserId;

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/posts/${post._id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");

      await API.delete(`/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (refreshFeed) refreshFeed();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header - More compact */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={post.user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=3B82F6&color=fff`}
              className="w-8 h-8 rounded-full border border-gray-200"
              alt={post.user.name}
            />
            <div>
              <p className="font-medium text-sm text-gray-900">{post.user.name}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>{post.user.rollNumber}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50 px-2 py-1"
            >
              {isDeleting ? "..." : "×"}
            </button>
          )}
        </div>
      </div>

      {/* Image - Fixed size */}
      {post.imageUrl && (
        <div className="w-full">
          <img 
            src={post.imageUrl} 
            className="w-full h-80 object-contain bg-gray-50" 
            alt="Post" 
            loading="lazy"
          />
        </div>
      )}

      {/* Caption - Compact */}
      {post.caption && (
        <div className="p-3 border-b border-gray-100">
          <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-3">{post.caption}</p>
        </div>
      )}

      {/* Actions - More compact */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
          >
            <svg 
              className={`w-4 h-4 ${isLiked ? 'text-red-600 fill-red-600' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-medium">{likes} like{likes !== 1 ? 's' : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;