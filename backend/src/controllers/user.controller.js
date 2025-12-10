import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// ✅ GET LOGGED IN USER
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("name profilePic rollNumber branch")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};


// ✅ LEADERBOARD
export const leaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ totalLikes: -1 })
      .limit(10)
      .select("name profilePic rollNumber totalLikes branch year");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load leaderboard",
    });
  }
};

// ✅ UPDATE PROFILE (NAME + IMAGE)
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    let updates = {};
    if (name) updates.name = name;

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "itm-connect-profiles",
      });

      updates.profilePic = uploadRes.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};
