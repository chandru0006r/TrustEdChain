import jwt from "jsonwebtoken";
import User from "../models/User.js"; // make sure this path is correct

export const verifyUserAuth = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

    // Now fetch the user from DB using the decoded id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // contains full Mongoose User doc
    req.userId = user._id; // optional shortcut
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
