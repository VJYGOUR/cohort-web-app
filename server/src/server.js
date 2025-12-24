// src/server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./lib/db.js";

// Optional: Test Redis connection

// Connect to MongoDB
connectDB().then(() => console.log("✅ MongoDB connected"));

// Start Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
