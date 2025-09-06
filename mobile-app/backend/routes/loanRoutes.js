import express from "express";
import {
  createLoanRequest,
  getAllLoans,
  getMyLoans,
  updateLoanStatus,
  getLoanById,
  getMyInvestments,
} from "../controllers/loanController.js";

import { verifyUserAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 POST - Student submits loan request
router.post("/request", verifyUserAuth, createLoanRequest);

// 📌 GET - Admin or Lender gets all loans
router.get("/all", verifyUserAuth, getAllLoans);

// 📌 GET - Student gets their loan history
router.get("/my", verifyUserAuth, getMyLoans);

router.get("/my-investments", verifyUserAuth, getMyInvestments);

// 📌 PATCH - Admin/Lender updates loan status
router.patch("/:loanId/status", verifyUserAuth, updateLoanStatus);

router.get("/:id", verifyUserAuth, getLoanById);



export default router;
