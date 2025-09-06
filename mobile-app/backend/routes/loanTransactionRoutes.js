import express from "express";
import {
  fundLoan,
  repayLoan,
  recordPenalty,
  recordForgiveness,
  getLoanTransactions,
} from "../controllers/loanTransactionController.js";

import { verifyUserAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 POST - Lender funds a loan
router.post("/fund/:loanId", verifyUserAuth, fundLoan);

// 📌 POST - Student repays a loan
router.post("/repay/:loanId", verifyUserAuth, repayLoan);

// 📌 POST - Admin records a penalty
router.post("/penalty/:loanId", verifyUserAuth, recordPenalty);

// 📌 POST - Admin records a forgiveness
router.post("/forgiveness/:loanId", verifyUserAuth, recordForgiveness);

// 📌 GET - Get all transactions for a loan
router.get("/:loanId", verifyUserAuth, getLoanTransactions);

export default router;
