import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  mobileNumber: {
    type: String,
  },

  role: {
    type: String,
    enum: ["user", "lender", "admin"],
    default: "user",
  },

  verified: {
    type: Boolean,
    default: false,
  },

  aadhaar: {
    url: String,
    uploadedAt: Date,
    verified: {
      type: Boolean,
      default: false,
    },
  },

  collegeId: {
    url: String,
    uploadedAt: Date,
    verified: {
      type: Boolean,
      default: false,
    },
  },

  selfie: {
    url: String,
    uploadedAt: Date,
    verified: {
      type: Boolean,
      default: false,
    },
  },

  blockchainAddress: {
    type: String,
    default: null,
  },

  uploadedToBlockchain: {
    type: Boolean,
    default: false,
  },

  trustScore: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
