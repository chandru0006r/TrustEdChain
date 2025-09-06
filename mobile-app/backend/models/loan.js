import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

    lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },
  
  amountRequested: {
    type: Number,
    required: true,
  },

  fundedAmount: {
    type: Number,
    default: 0,
  },

  purpose: {
    type: String,
    required: true,
  },

  durationMonths: {
    type: Number,
    required: true,
  },

  interestRate: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["pending", "funded", "active", "repaid", "defaulted"],
    default: "pending",
  },

  repaymentProgress: {
    type: Number,
    default: 0,
  },

  blockchainTxHash: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Loan", loanSchema);
