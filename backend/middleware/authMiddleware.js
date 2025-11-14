// FILE: middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * ✅ Middleware: Verify JWT token and role-based access
 * @param {Array<string>} roles - List of roles allowed to access the route
 */
export const verifyRole = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 🔍 Check if Authorization header exists
    if (!authHeader) {
      console.warn("⚠️  No token provided in request headers");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // 🔐 Verify token validity
      const user = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔑 Token verified:", user);

      // 🔒 Check user role
      if (!roles.includes(user.role)) {
        console.warn(`🚫 Access denied for role: ${user.role}`);
        return res.status(403).json({ message: "Access denied: insufficient role" });
      }

      // ✅ Attach user info to request for later use
      req.user = user;
      next();
    } catch (err) {
      console.error("❌ Invalid token:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

