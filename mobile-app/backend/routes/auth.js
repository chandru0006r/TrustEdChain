import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// 🔐 Register
router.post("/register", async (req, res) => {
    const { name, email, password, mobileNumber, role } = req.body; // 🆕 extract role
  
    try {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        mobileNumber,
        role: role || "user", // 🆕 assign role (default to 'user' if missing)
        verified: false,
        aadhaar: { url: "", verified: false },
        collegeId: { url: "", verified: false },
        selfie: { url: "", verified: false },
        blockchainAddress: null,
        uploadedToBlockchain: false,
        trustScore: 0,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  

// 🔑 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        trustScore: user.trustScore,
        blockchainAddress: user.blockchainAddress,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🚪 Logout (frontend should handle token removal)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully (frontend should clear token)" });
});

export default router;
