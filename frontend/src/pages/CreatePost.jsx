// components/CreatePostCard.jsx - FIXED (NO FILE SIZE LIMIT)
import { useState } from "react";
import API from "../services/authService";
import { Image, X, Upload, Loader2, CheckCircle } from "lucide-react";

const CreatePostCard = ({ refreshFeed }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Handle image selection (NO SIZE LIMIT)
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Only type validation remains
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Remove selected image
  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setError("");
    setSuccess("");
  };

  // ✅ Upload post
  const handlePost = async () => {
    setError("");
    setSuccess("");

    if (!image) {
      setError("Please select an image to upload");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption.trim());

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const response = await API.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success === true) {
        setSuccess("Post uploaded successfully!");

        setTimeout(() => {
          setImage(null);
          setCaption("");
          setPreview(null);
          setSuccess("");
          refreshFeed?.();
        }, 1200);
      } else {
        setError(response.data?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to upload post. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset form
  const handleReset = () => {
    setImage(null);
    setCaption("");
    setPreview(null);
    setError("");
    setSuccess("");
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900">Create a Post</h2>
            <p className="text-sm text-gray-500">Share photos with your peers</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* ✅ Success */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* ❌ Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <X className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Caption */}
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full h-28 border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Write something about your photo..."
      />

      {/* Preview */}
      {preview && (
        <div className="mb-4 relative">
          <img src={preview} className="w-full max-h-96 object-cover rounded-lg" />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload */}
      {!image && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-blue-400 hover:bg-blue-50 mb-6">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Click to upload image</p>
          <input type="file" accept="image/*" hidden onChange={handleImage} />
        </label>
      )}

      {/* Button */}
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-sm text-gray-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Visible to all ITM students
        </span>

        <button
          onClick={handlePost}
          disabled={loading || !image}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> Publish
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePostCard;
