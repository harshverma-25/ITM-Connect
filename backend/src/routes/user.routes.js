import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { getAllUsers } from "../controllers/user.controller.js";
import {
  getMe,
  leaderboard,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/leaderboard", leaderboard);
router.put("/update", protect, upload.single("image"), updateProfile);
router.get("/all", protect, getAllUsers);


export default router;
