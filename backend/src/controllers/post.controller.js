import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

import sharp from "sharp";
import fs from "fs";
import path from "path";

// =====================================
// ✅ CREATE POST WITH IMAGE COMPRESSION
// =====================================
export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file received",
      });
    }

    const compressedPath = path.join(
      "uploads",
      `compressed-${Date.now()}.jpg`
    );

    // ✅ Compress image (High Quality, Very Small Size)
    await sharp(req.file.path)
      .resize({ width: 1080 })
      .jpeg({ quality: 80 })
      .toFile(compressedPath);

    // ✅ Upload compressed image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(compressedPath, {
      folder: "itm-connect-posts",
    });

    // ✅ Create post in DB
    const post = await Post.create({
      user: req.user._id,
      imageUrl: uploadRes.secure_url,
      caption: req.body.caption || "",
    });

    // ✅ Delete temp files
    fs.unlinkSync(req.file.path);
    fs.unlinkSync(compressedPath);

    const populatedPost = await post.populate(
      "user",
      "name profilePic rollNumber branch year"
    );

    return res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (error) {
    console.error("❌ CREATE POST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

// =======================
// ✅ GLOBAL FEED
// =======================
export const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name profilePic rollNumber branch year");

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Get feed error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feed",
    });
  }
};

// =======================
// ✅ USER POSTS
// =======================
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name profilePic rollNumber branch year");

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user posts",
    });
  }
};

// =======================
// ✅ LIKE POST (Only Like)
// =======================
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.likedBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You already liked this post",
      });
    }

    post.likedBy.push(userId);
    post.likesCount += 1;
    await post.save();

    // ✅ Increase creator total likes
    await User.findByIdAndUpdate(post.user, {
      $inc: { totalLikes: 1 },
    });

    return res.status(200).json({
      success: true,
      message: "Post liked",
      data: {
        postId: post._id,
        likesCount: post.likesCount,
      },
    });
  } catch (error) {
    console.error("Like post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to like post",
    });
  }
};

// =======================
// ✅ DELETE POST (OWNER ONLY)
// =======================
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};
