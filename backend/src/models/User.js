import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    googleId: String,
    profilePic: String,

    rollNumber: {
      type: String,
      unique: true,
      required: true
    },

    branch: String,
    year: Number,

    totalLikes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
