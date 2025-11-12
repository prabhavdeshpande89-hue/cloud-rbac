// FILE: routes/authRoutes.js

import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

/**
 * 🔐 Authentication Routes
 * Handles user registration and login
 */

// ✅ Register user
router.post("/register", (req, res, next) => {
  console.log("📨 Incoming POST /auth/register");
  register(req, res, next);
});

// ✅ Login user
router.post("/login", (req, res, next) => {
  console.log("📨 Incoming POST /auth/login");
  login(req, res, next);
});

export default router;

