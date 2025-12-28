import express from "express";
import {
  createCourse,
  updateCourse,
  getAdminCourses,
  getPublishedCourses,
} from "../controllers/course.controllers.js";
import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

/* Public */
router.get("/courses", getPublishedCourses);

/* Admin */
router.post("/admin/courses", protect, requireAdmin, createCourse);
router.get("/admin/courses", protect, requireAdmin, getAdminCourses);
router.put("/admin/courses/:id", protect, requireAdmin, updateCourse);

export default router;
