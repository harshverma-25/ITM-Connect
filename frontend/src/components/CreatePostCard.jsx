// components/CreatePostCard.jsx - MORE COMPACT
import { useState } from "react";
import API from "../services/authService";

const CreatePostCard = ({ refreshFeed }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ IMAGE PICK - SAME LOGIC
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ REAL POST UPLOAD - SAME LOGIC
  const handlePost = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);

      await API.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ RESET FORM
      setImage(null);
      setCaption("");
      setPreview(null);

      // ✅ REFRESH FEED
      refreshFeed();

    } catch (err) {
      alert("Post upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      {/* Header - More compact */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white">📷</span>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">Create Post</h2>
          <p className="text-xs text-gray-500">Upload a photo for ITM students</p>
        </div>
      </div>

      {/* Caption - Compact */}
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full h-20 border border-gray-300 rounded-lg p-3 outline-none resize-none 
                   focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                   placeholder-gray-400 text-sm text-gray-900"
        placeholder="Write a caption for your image..."
      />

      {/* ✅ IMAGE PREVIEW - Fixed height */}
      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="preview"
            className="w-full h-48 object-contain rounded-lg border border-gray-300 bg-gray-50"
          />
        </div>
      )}

      {/* ✅ IMAGE UPLOAD - Compact */}
      <div className="mt-3 flex items-center justify-between">
        <label className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition cursor-pointer border border-blue-100">
          <span className="text-sm">📷</span>
          <span className="font-medium">Upload Image</span>
          <input 
            type="file" 
            accept="image/*" 
            hidden 
            onChange={handleImage}
            disabled={loading}
          />
        </label>
        
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          All ITM students
        </div>
      </div>

      {/* Post Button - Compact */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={handlePost}
          disabled={loading || !image}
          className={`w-full py-2.5 text-sm font-medium rounded-lg transition
            ${loading || !image
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {loading ? "Uploading..." : "Publish Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePostCard;