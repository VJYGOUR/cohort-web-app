import express from "express";
import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getAdminStats } from "../controllers/admin.controllers.js";
const router = express.Router();
router.get("/admin/stats", protect, requireAdmin, getAdminStats);
export default router;
