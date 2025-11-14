// FILE: index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"; // ✅ only once
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Debug confirmation for route imports
console.log("✅ authRoutes imported:", typeof authRoutes);
console.log("✅ userRoutes imported:", typeof userRoutes);

// ✅ Mount Routes
app.use("/auth", authRoutes);
app.use("/api", userRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 RBAC Cloud Application running successfully on Ubuntu Linux!");
});

// ✅ Temporary test route
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.all(/.*/, (req, res) => {
  console.log("⚠️  Unhandled request:", req.method, req.url);
  res.status(404).json({ message: "Route not found" });
});


// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("🌐 Base URL: http://localhost:" + PORT);
});

