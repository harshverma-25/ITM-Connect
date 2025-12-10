// pages/EditProfile.jsx - FIXED
import { useEffect, useState } from "react";
import API from "../services/authService";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowLeft, Save } from "lucide-react";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/users/me");
        const userData = res.data.data;
        setName(userData.name || "");
        setEmail(userData.email || "");
        setBranch(userData.branch || "");
        setRollNumber(userData.rollNumber || "");
        setPreview(userData.profilePic || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("branch", branch);
    formData.append("rollNumber", rollNumber);
    if (image) formData.append("image", image);

    try {
      await API.put("/users/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully ✅");
      navigate("/profile/me");
    } catch (error) {
      console.error("Update error:", error);
      alert("Profile update failed ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600 mt-2">Update your personal information</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={updateProfile}>
            {/* Profile Picture Section */}
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/30">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-colors">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-600">Click the camera icon to change your photo</p>
                <p className="text-xs text-gray-500 mt-1">Recommended: 500x500px, JPG or PNG</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 0905IT231055"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Branch</option>
                    <option value="IT">Information Technology</option>
                    <option value="CS">Computer Science</option>
                    <option value="CE">Computer Engineering</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="AL">Artificial Intelligence</option>
                    <option value="EE">Electrical Engineering</option>
                  </select>
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell others about yourself..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-8 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting || !name.trim()
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProfile;