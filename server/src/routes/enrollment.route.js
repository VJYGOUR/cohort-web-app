import express from "express";
import {
  createEnrollment,
  getUserEnrollments,
} from "../controllers/enrollment.controllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createEnrollment);
router.get("/user/enrollments", protect, getUserEnrollments);

export default router;
