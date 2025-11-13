// FILE: routes/userRoutes.js

import express from "express";
import { verifyRole } from "../middleware/authMiddleware.js";
import pool from "../models/db.js";

const router = express.Router();

/**
 * 👤 GET Profile (Authenticated users)
 * Route: GET /api/profile
 */
router.get("/profile", verifyRole(["admin", "user"]), async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, username, email, role FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile fetched successfully",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * 👥 Admin-only: Get all users
 * Route: GET /api/users
 */
router.get("/users", verifyRole(["admin"]), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role FROM users"
    );

    res.json({
      message: "All users fetched",
      data: result.rows
    });

  } catch (err) {
    console.error("Users fetch error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * 👑 Admin protected route
 * Route: GET /api/admin
 */
router.get("/admin", verifyRole(["admin"]), (req, res) => {
  console.log(`🧑‍💼 Admin access granted: ID ${req.user.id}`);
  res.json({ message: "Welcome Admin!", user: req.user });
});

/**
 * 👤 User or Admin allowed
 * Route: GET /api/user
 */
router.get("/user", verifyRole(["admin", "user"]), (req, res) => {
  console.log(`👤 User access granted: ID ${req.user.id}`);
  res.json({ message: "Welcome User!", user: req.user });
});

/**
 * 🌍 Public (no auth needed)
 * Route: GET /api/public
 */
router.get("/public", (req, res) => {
  res.json({ message: "Public endpoint - no authentication required." });
});

export default router;
