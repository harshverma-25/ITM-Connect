import axios from "axios";
import qs from "qs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateRollNumber } from "../utils/rollValidator.js";

/**
 * ✅ STEP 1: VALIDATE ROLL (ONLY FORMAT CHECK — NO DB CHECK)
 * This just checks if the roll number follows ITM logic.
 */
export const validateRoll = async (req, res) => {
  try {
    const { rollNumber } = req.body;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Roll number is required",
      });
    }

    const result = validateRollNumber(rollNumber);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // ✅ ONLY CONFIRM IT IS A VALID ITM ROLL
    return res.status(200).json({
      success: true,
      message: "Valid ITM roll number",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Roll validation failed",
    });
  }
};

/**
 * ✅ STEP 2: REDIRECT TO GOOGLE (WITH ROLL NUMBER)
 */
export const googleAuthRedirect = (req, res) => {
  const { rollNumber } = req.query;

  if (!rollNumber) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/?error=roll-missing`
    );
  }

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${qs.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    prompt: "consent",
    state: rollNumber, // ✅ PASS ROLL SECURELY VIA STATE
  })}`;

  res.redirect(url);
};

/**
 * ✅ STEP 3: GOOGLE CALLBACK → AUTO REGISTER OR LOGIN → JWT
 */
export const googleAuthCallback = async (req, res) => {
  try {
    const { code, state } = req.query; // ✅ state = rollNumber

    if (!code || !state) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/?error=invalid-auth`
      );
    }

    // ✅ Re-validate roll safely on backend
    const rollResult = validateRollNumber(state);
    if (!rollResult.valid) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/?error=invalid-roll`
      );
    }

    // ✅ Exchange code → Google access token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    // ✅ Fetch Google profile
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const googleUser = userRes.data;

    // ✅ FIND OR CREATE USER (AUTO REGISTER)
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        profilePic: googleUser.picture,
        googleId: googleUser.id,
        rollNumber: state,
        branch: rollResult.branch,
        year: rollResult.yearShort,
      });
    }

    // ✅ CREATE JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/login?token=${token}`
    );
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/?error=login-failed`
    );
  }
};
