// FILE: controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ REGISTER USER
 */
export const register = async (req, res) => {
  const startTime = Date.now();
  console.log("📩 [REGISTER] API hit with body:", req.body);

  try {
    const { username, email, password, role } = req.body;

    // 🧩 1. Basic Validation
    if (!username || !email || !password || !role) {
      console.warn("⚠️ Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🧩 2. Check DB Connection (sanity check)
    try {
      await pool.query("SELECT 1");
    } catch (dbErr) {
      console.error("❌ Database not responding:", dbErr.message);
      return res.status(500).json({ message: "Database connection failed", error: dbErr.message });
    }

    // 🧩 3. Check for existing user
    console.log("🔍 Checking if user exists...");
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      console.warn("⚠️ User already exists with this email");
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // 🧩 4. Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧩 5. Insert into DB
    console.log("💾 Inserting user into DB...");
    const query = "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)";
    const values = [username, email, hashedPassword, role];
    await pool.query(query, values);

    console.log("✅ User registered successfully:", email);
    const endTime = Date.now();
    console.log(`⏱️ Registration completed in ${endTime - startTime}ms`);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Register error:", error.message);

    // Special case: permission denied
    if (error.message.includes("permission denied")) {
      return res.status(500).json({
        message: "Database permission denied. Please run GRANT commands in PostgreSQL.",
        error: error.message,
      });
    }

    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

/**
 * ✅ LOGIN USER
 */
export const login = async (req, res) => {
  const startTime = Date.now();
  console.log("🔐 [LOGIN] API hit with body:", req.body);

  try {
    const { email, password } = req.body;

    // 🧩 1. Validate fields
    if (!email || !password) {
      console.warn("⚠️ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 🧩 2. Fetch user
    console.log("🔍 Fetching user from DB...");
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      console.warn("⚠️ User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // 🧩 3. Verify password
    console.log("🔑 Verifying password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn("⚠️ Invalid password for:", email);
      return res.status(401).json({ message: "Invalid password" });
    }

    // 🧩 4. Generate JWT token
    console.log("🎟️ Generating token...");
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful for:", email);
    const endTime = Date.now();
    console.log(`⏱️ Login completed in ${endTime - startTime}ms`);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

