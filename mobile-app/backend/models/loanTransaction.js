import mongoose from "mongoose";

const loanTransactionSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },

  transactionType: {
    type: String,
    enum: ["fund", "repayment", "penalty", "forgiveness"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  txNote: {
    type: String,
  },

  blockchainTxHash: {
    type: String,
    default: null,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LoanTransaction", loanTransactionSchema);
