// FILE: models/db.js

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Determine if SSL is needed (local = no, cloud = yes)
const isLocalhost = process.env.DB_HOST === "localhost";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: isLocalhost
    ? false
    : {
        require: true,
        rejectUnauthorized: false, // needed for AWS RDS default cert
      },
});

// ✅ Test the connection when app starts
pool
  .connect()
  .then((client) => {
    console.log(
      `✅ PostgreSQL connected successfully to: ${process.env.DB_DATABASE} (${process.env.DB_HOST})`
    );
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
  });

export default pool;
