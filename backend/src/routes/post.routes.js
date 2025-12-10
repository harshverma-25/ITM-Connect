import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { deletePost } from "../controllers/post.controller.js";

import {
  createPost,
  getFeed,
  getUserPosts,
  likePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// ✅ IMAGE UPLOAD ROUTE (THIS IS CRITICAL)
router.post("/", protect, upload.single("image"), createPost);

router.get("/feed", protect, getFeed);
router.get("/user/:userId", protect, getUserPosts);
router.post("/:postId/like", protect, likePost);
router.delete("/:postId", protect, deletePost);

export default router;
