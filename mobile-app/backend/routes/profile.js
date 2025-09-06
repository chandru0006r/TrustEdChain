import express from "express";
import User from "../models/User.js";
import multer from "multer";
import { adminAuth } from "../middleware/adminAuth.js";
import { verifyUserAuth } from "../middleware/verifyUserAuth.js";
import fs from "fs";

const router = express.Router();

// 📁 File Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ✅ File Filter for Aadhaar & Selfie
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type for ${file.fieldname}`), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// 📤 Upload Aadhaar & Selfie (User Only)
router.post(
    "/upload",
    verifyUserAuth,
    upload.fields([
      { name: "aadhaar", maxCount: 1 },
      { name: "selfie", maxCount: 1 },
      { name: "collegeId", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const aadhaarPath = req.files["aadhaar"]?.[0]?.path || null;
        const selfiePath = req.files["selfie"]?.[0]?.path || null;
        const collegeIdPath = req.files["collegeId"]?.[0]?.path || null;
  
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });
  
        if (aadhaarPath) {
          user.aadhaar.url = aadhaarPath;
          user.aadhaar.uploadedAt = new Date();
        }
  
        if (selfiePath) {
          user.selfie.url = selfiePath;
          user.selfie.uploadedAt = new Date();
        }
  
        if (collegeIdPath) {
          user.collegeId.url = collegeIdPath;
          user.collegeId.uploadedAt = new Date();
        }
  
        await user.save();
  
        res.json({
          message: "Documents uploaded successfully",
          user,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error uploading files", error: err.message });
      }
    }
  );
  
// 🔧 Update User Profile (User Only)
router.put("/update", verifyUserAuth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 👤 Get Current User Profile (User Only)
router.get("/", verifyUserAuth, async (req, res) => {
  console.log("profile called....");
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get('/student/:id', verifyUserAuth, async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await User.findById(studentId).select('-password'); // Exclude password

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
