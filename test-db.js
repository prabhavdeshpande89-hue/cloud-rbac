  // FILE: test-db.js

  import pool from "./models/db.js";

  (async () => {
    try {
      const res = await pool.query("SELECT NOW()");
      console.log("✅ Database connected successfully at:", res.rows[0].now);
      process.exit(0);
    } catch (err) {
      console.error("❌ Database connection failed:", err.message);
      process.exit(1);
    }
  })();

