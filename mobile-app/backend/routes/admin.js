import express from "express";
import User from "../models/User.js";
import { adminAuth } from "../middleware/adminAuth.js"; // Admin authorization middleware

const router = express.Router();

// 🔹 Get all unverified users (Admin Only)
router.get("/unverified", adminAuth, async (req, res) => {
  try {
    const unverifiedUsers = await User.find({ verified: false }).select("-password");
    res.status(200).json(unverifiedUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unverified users", error: err.message });
  }
});

// 🔹 Verify a user by ID (Admin Only)
router.post("/verify/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User verified successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify user", error: err.message });
  }
});

export default router;
