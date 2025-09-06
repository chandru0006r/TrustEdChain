import LoanTransaction from "../models/loanTransaction.js";
import Loan from "../models/loan.js";
import { 
  fundLoanOnBlockchain, 
  repayLoanOnBlockchain, 
  recordPenaltyOnBlockchain, 
  recordForgivenessOnBlockchain
} from "../utils/blockchain.js";

// 📌 Fund a loan
export const fundLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, txNote } = req.body;
    const user = req.user._id;

    console.log("Fund loan called by user:", user);

    // Find the loan
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    console.log("Student:", loan.student);
    console.log("Lender:", loan.lender);

    // Check if student field exists before comparing
    if (loan.student && loan.student.equals(user)) {
      return res.status(403).json({ message: "You cannot fund your own loan." });
    }

    // Set the lender if not already set
    if (!loan.lender || (loan.lender.equals && loan.lender.equals(loan.student))) {
      loan.lender = user;
      console.log("Lender set to:", user);
    } else if (loan.lender && loan.lender.equals && !loan.lender.equals(user)) {
      return res.status(403).json({ message: "This loan is already being funded by another lender." });
    }

    // Create the funding transaction
    const newTransaction = new LoanTransaction({
      loan: loanId,
      transactionType: "fund",
      amount,
      performedBy: user,
      txNote,
    });

    await newTransaction.save();

    // Update funded amount and loan status
    loan.fundedAmount += amount;
    if (loan.fundedAmount >= loan.amountRequested) {
      loan.status = "funded";
    }

    await loan.save();

    // Simulate blockchain funding
    const txHash = await fundLoanOnBlockchain(loanId, amount);
    newTransaction.blockchainTxHash = txHash;
    await newTransaction.save();

    res.status(201).json({
      message: "Loan funded successfully",
      transaction: newTransaction,
    });

  } catch (err) {
    console.error("Error funding loan:", err);
    res.status(500).json({ message: "Failed to fund the loan" });
  }
};



// 📌 Repay a loan
export const repayLoan = async (req, res) => {
  try {
    const loanId = req.params.loanId;
    const { amount } = req.body;
    const userId = req.user._id;

    // 1. Find the loan
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // 2. Check if current user is the loan requester
    if (loan.student.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to repay this loan" });
    }

    // 3. Check if loan is already fully repaid
    if (loan.repaymentProgress >= loan.amountRequested) {
      return res.status(400).json({ message: "Loan already fully repaid" });
    }

    // 4. Update repayment progress
    loan.repaymentProgress += amount;
    if (loan.repaymentProgress > loan.amountRequested) {
      loan.repaymentProgress = loan.amountRequested; // cap it
    }

    await loan.save();

    // 5. Save the repayment transaction
    const txn = new LoanTransaction({
      loan: loanId,
      performedBy: userId,
      amount,
      transactionType: "repayment",
    });

    await txn.save();

    // Blockchain interaction: Simulate repayment transaction
    const txHash = await repayLoanOnBlockchain(loanId, amount);
    txn.blockchainTxHash = txHash;
    await txn.save();

    res.status(200).json({ message: "Repayment recorded successfully", transaction: txn });
  } catch (err) {
    console.error("Repayment error:", err);
    res.status(500).json({ message: "Failed to process repayment" });
  }
};

// 📌 Record penalty for a loan
export const recordPenalty = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, txNote } = req.body;
    const user = req.user._id;
    const role = req.user.role;

    // Check if loan exists
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Only the lender or an admin can impose penalty
    const isLender = loan.lender && loan.lender.equals(user);
    const isAdmin = role === "admin";

    if (!isLender && !isAdmin) {
      return res.status(403).json({ message: "Only the lender or an admin can impose a penalty." });
    }

    // Create a new loan transaction (penalty)
    const newTransaction = new LoanTransaction({
      loan: loanId,
      transactionType: "penalty",
      amount,
      performedBy: user,
      txNote,
    });

    await newTransaction.save();

    // Blockchain interaction: Simulate penalty transaction
    const txHash = await recordPenaltyOnBlockchain(loanId, amount);
    newTransaction.blockchainTxHash = txHash;
    await newTransaction.save();

    res.status(201).json({ message: "Penalty recorded successfully", transaction: newTransaction });
  } catch (err) {
    console.error("Error recording penalty:", err);
    res.status(500).json({ message: "Failed to record penalty" });
  }
};


export const getLoanTransactions = async (req, res) => {
  try {
    const { loanId } = req.params;

    // Find all transactions related to the specified loan ID
    const transactions = await LoanTransaction.find({ loan: loanId }).populate('performedBy', 'name email');

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this loan' });
    }

    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching loan transactions:', err);
    res.status(500).json({ message: 'Error retrieving loan transactions' });
  }
};

// 📌 Record forgiveness for a loan
export const recordForgiveness = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, txNote } = req.body;
    const user = req.user._id;

    // 1️⃣ Check if loan exists
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // 2️⃣ Check if the current user is the lender who issued the loan
    if (loan.lender.toString() !== user.toString()) {
      return res.status(403).json({ message: "Access denied. Only the loan's lender can record forgiveness." });
    }

    // 3️⃣ Create a new loan transaction (forgiveness)
    const newTransaction = new LoanTransaction({
      loan: loanId,
      transactionType: "forgiveness",
      amount,
      performedBy: user,
      txNote,
    });

    await newTransaction.save();

    // 4️⃣ Blockchain interaction: Simulate forgiveness transaction
    const txHash = await recordForgivenessOnBlockchain(loanId, amount);
    newTransaction.blockchainTxHash = txHash;
    await newTransaction.save();

    res.status(201).json({ message: "Forgiveness recorded successfully", transaction: newTransaction });
  } catch (err) {
    console.error("Error recording forgiveness:", err);
    res.status(500).json({ message: "Failed to record forgiveness" });
  }
};
