// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import healthRoute from "./routes/health.route.js";
import authRoutes from "./routes/auth.route.js";
import testRoutes from "./routes/test.route.js";
import adminRoutes from "./routes/admin.route.js";
const app = express();

// __dirname polyfill for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/health", healthRoute);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
// Consider renaming to avoid path conflicts

// Serve React build for production
const clientBuildPath = path.join(__dirname, "../../client/dist");

app.use(express.static(clientBuildPath));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

export default app;
