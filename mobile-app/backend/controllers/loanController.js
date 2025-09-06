import Loan from "../models/loan.js";
import LoanTransaction from "../models/loanTransaction.js";
import { writeLoanToBlockchain, updateLoanStatusOnBlockchain } from "../utils/blockchain.js";


export const getMyInvestments = async (req, res) => {
  try {
    const investorId = req.user._id;
    console.log("Investor ID:", investorId);

    // 1. Get all fund transactions by this user
    const transactions = await LoanTransaction.find({
      performedBy: investorId,
      transactionType: "fund",
    }).populate("loan");

    console.log("Fund transactions found:", transactions.length);

    if (transactions.length === 0) {
      return res.status(200).json([]); // No investments made
    }

    // 2. Extract all loan IDs from the transactions
    const loanIds = transactions
      .filter((tx) => tx.loan) // Make sure loan is not null
      // .filter((tx) => tx.loan.funded === true) // Uncomment if needed
      .map((tx) => tx.loan._id.toString());

    const uniqueLoanIds = [...new Set(loanIds)];
    console.log("Unique loan IDs:", uniqueLoanIds);

    if (uniqueLoanIds.length === 0) {
      return res.status(200).json([]); // No valid loans
    }

    // 3. Fetch loan details
    const loans = await Loan.find({ _id: { $in: uniqueLoanIds } }).populate(
      "student",
      "name email"
    );

    // 4. Calculate total invested per loan
    const investmentsByLoan = {};
    for (const tx of transactions) {
      const loanId = tx.loan?._id?.toString();
      if (loanId) {
        investmentsByLoan[loanId] =
          (investmentsByLoan[loanId] || 0) + tx.amount;
      }
    }

    // 5. Build the response
    const result = loans.map((loan) => ({
      _id: loan._id,
      purpose: loan.purpose,
      amountRequested: loan.amountRequested,
      amountInvested: investmentsByLoan[loan._id.toString()] || 0,
      status: loan.status,
      funded: loan.funded,
      student: loan.student,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getMyInvestments:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching investments." });
  }
};




// 📌 Get a loan by its ID
export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("student", "name email");

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    console.error("Error fetching loan by ID:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Create a loan request
export const createLoanRequest = async (req, res) => {
  try {
    const { amountRequested, purpose, durationMonths, interestRate } = req.body;
    const studentId = req.user._id;
    const userRole = req.user.role; // Assuming role is set by your auth middleware

    // ✅ Allow only users with role 'user' or 'student'
    if (!userRole || userRole !== 'user') {
      return res.status(403).json({ message: "Only users can request loans" });
    }

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const newLoan = new Loan({
      student: studentId,
      amountRequested,
      purpose,
      durationMonths,
      interestRate,
      lender: studentId,
    });

    await newLoan.save();

    // 🎯 Using dummy blockchain interaction
    const txHash = await writeLoanToBlockchain(newLoan._id, {
      student: studentId,
      amountRequested,
      purpose,
      durationMonths,
      interestRate,
      lender: null,
    });

    newLoan.blockchainTxHash = txHash;
    await newLoan.save();

    res.status(201).json({ message: "Loan request created", loan: newLoan });
  } catch (err) {
    console.error("Loan request error:", err);
    res.status(500).json({ message: "Failed to create loan request" });
  }
};

// 📌 Get all loans - for admin/lender
export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("student", "name email");
    res.json(loans);
  } catch (err) {
    console.error("Error fetching all loans:", err);
    res.status(500).json({ message: "Error retrieving loans" });
  }
};

// 📌 Get logged-in user's loans - student
export const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ student: req.user._id });
    res.json(loans);
  } catch (err) {
    console.error("Error fetching user's loans:", err);
    res.status(500).json({ message: "Error retrieving your loan history" });
  }
};

// 📌 Update loan status - admin/lender
export const updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "funded", "active", "repaid", "defaulted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid loan status" });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.status = status;
    loan.updatedAt = Date.now();
    await loan.save();

    // 🎯 Using dummy blockchain interaction
    await updateLoanStatusOnBlockchain(loan._id, status);

    res.json({ message: "Loan status updated", loan });
  } catch (err) {
    console.error("Error updating loan status:", err);
    res.status(500).json({ message: "Error updating loan status" });
  }
};
