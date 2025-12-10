import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({})
      .sort({ totalLikes: -1 })
      .limit(limit)
      .select("name profilePic rollNumber branch year totalLikes");

    const ranked = users.map((user, index) => ({
      rank: index + 1,
      _id: user._id,
      name: user.name,
      profilePic: user.profilePic,
      rollNumber: user.rollNumber,
      branch: user.branch,
      year: user.year,
      totalLikes: user.totalLikes
    }));

    res.status(200).json({
      success: true,
      data: ranked
    });
  } catch (error) {
    console.error("Leaderboard error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard"
    });
  }
};
