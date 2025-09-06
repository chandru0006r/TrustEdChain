import express from "express";
import { verifyUserAuth } from "../middleware/authMiddleware.js";
import { getStudentStats, getTrustScore, getLenderStats } from "../controllers/dashboardController.js";

const router = express.Router();

// 🧑‍🎓 Student Dashboard
router.get("/student-stats", verifyUserAuth, getStudentStats);

router.get("/trust-score", verifyUserAuth, getTrustScore);

// 💼 Lender Dashboard
router.get("/investor-stats", verifyUserAuth, getLenderStats);

export default router;
