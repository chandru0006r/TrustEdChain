import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin.js";
import blockchainRoutes from "./routes/blockchainRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import loanTransactionRoutes from "./routes/loanTransactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import interestRate from "./routes/InterestRates.js";

// Config
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Static upload folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/trustedchain");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
connectToDatabase();

// Route bindings
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/loan", loanRoutes); // 🆕 Loan logic
app.use("/api/transactions", loanTransactionRoutes); // 🆕 Repayments & funding
app.use("/api/dashboard", dashboardRoutes); // 🆕 Student/lender dashboard
app.use("/api/interest-rate", interestRate); // 🆕 Student/lender dashboard

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down server...");
  mongoose.connection.close(() => {
    console.log("🔌 MongoDB connection closed.");
    process.exit(0);
  });
});
