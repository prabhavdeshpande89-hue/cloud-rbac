// FILE: routes/userRoutes.js

import express from "express";
import { verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 👥 Role-based Routes
 * These routes are protected by verifyRole middleware.
 */

// ✅ ADMIN-ONLY route
router.get("/admin", verifyRole(["admin"]), (req, res) => {
  console.log(`🧑‍💼 Admin access granted to user ID: ${req.user.id}, Role: ${req.user.role}`);
  res.json({ message: "Welcome Admin!", user: req.user });
});

// ✅ ADMIN + USER route
router.get("/user", verifyRole(["admin", "user"]), (req, res) => {
  console.log(`👤 User access granted to ID: ${req.user.id}, Role: ${req.user.role}`);
  res.json({ message: "Welcome User!", user: req.user });
});

// ✅ PUBLIC route (optional)
router.get("/public", (req, res) => {
  res.json({ message: "Public endpoint: No authentication required." });
});

export default router;

