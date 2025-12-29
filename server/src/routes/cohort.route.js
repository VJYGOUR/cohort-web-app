import express from "express";
import {
  createCohort,
  getCohortsByCourse,
  updateCohort,
} from "../controllers/cohort.controllers.js";
import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.post("/admin/cohorts", protect, requireAdmin, createCohort);
router.get("/admin/cohorts", protect, requireAdmin, getCohortsByCourse);
router.put("/admin/cohorts/:id", protect, requireAdmin, updateCohort);

export default router;
