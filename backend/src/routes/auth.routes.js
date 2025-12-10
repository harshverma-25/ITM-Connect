import express from "express";
import {
  validateRoll,
  googleAuthRedirect,
  googleAuthCallback
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/validate-roll", validateRoll);
router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

export default router;
