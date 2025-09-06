import Loan from "../models/loan.js";
import Transaction from "../models/loanTransaction.js";
import User from "../models/User.js";

// 🎓 Student Dashboard Stats
export const getStudentStats = async (req, res) => {
  try {

    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied: Only students can access this" });
    }

    const userId = req.user._id;

    const allLoans = await Loan.find({ student: userId });
    console.log(allLoans);
    const totalLoans = allLoans.length;
    const activeLoans = allLoans.filter(loan => ["approved", "funded"].includes(loan.status)).length;
    const repaidLoans = allLoans.filter(loan => loan.status === "repaid").length;
    const pendingApproval = allLoans.filter(loan => loan.status === "pending").length;

    const totalBorrowed = allLoans.reduce((sum, loan) => sum + (loan.amount || 0), 0);

    res.status(200).json({
      totalLoans,
      activeLoans,
      repaidLoans,
      pendingApproval,
      totalBorrowed,
    });
  } catch (error) {
    console.error("Student stats error:", error);
    res.status(500).json({ message: "Error getting student stats", error });
  }
};

// 🎓 Trust Score from User Model
export const getTrustScore = async (req, res) => {
  try {
    if (req.user.role !== "user") {
        return res.status(403).json({ message: "Access denied: Only students can access trust score" });
      }
  
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ trustScore: user.trustScore || 0 });
  } catch (error) {
    console.error("Trust score error:", error);
    res.status(500).json({ message: "Error retrieving trust score", error });
  }
};

// 💼 Lender Dashboard Stats
export const getLenderStats = async (req, res) => {
  try {
    if (req.user.role !== "lender") {
      return res.status(403).json({ message: "Access denied: Only lenders can access this" });
    }

    const userId = req.user._id;

    // Fetch all funding transactions done by this user
    const fundedTxns = await Transaction.find({
      performedBy: userId,
      transactionType: "fund",
    });

    const fundedLoanIds = fundedTxns.map(txn => txn.loan);
    const fundedLoans = await Loan.find({ _id: { $in: fundedLoanIds } });

    const totalFunded = fundedTxns.length;
    const totalAmountFunded = fundedTxns.reduce((sum, txn) => sum + (txn.amount || 0), 0);
    
    // Now classify loans into active and repaid
    const activeLoans = fundedLoans.filter(loan => ["approved", "funded"].includes(loan.status)).length;
    const repaidLoans = fundedLoans.filter(loan => loan.status === "repaid").length;

    res.status(200).json({
      totalFunded,            // Number of funding actions by this lender
      totalAmountFunded,      // Total amount actually funded by this lender
      activeLoans,            // Loans in progress
      repaidLoans             // Fully repaid loans
    });

  } catch (error) {
    console.error("Lender stats error:", error);
    res.status(500).json({ message: "Error fetching lender stats", error });
  }
};
