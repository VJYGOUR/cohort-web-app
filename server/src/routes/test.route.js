import express from "express";
import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
const router = express.Router();
router.get("/user-only", protect, (req, res) => {
  res.json({ message: "User access OK" });
});

router.get("/admin-only", protect, requireAdmin, (req, res) => {
  res.json({ message: "Admin access OK" });
});
export default router;
