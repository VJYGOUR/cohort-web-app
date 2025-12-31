// routes/public.routes.js
import express from "express";
import {
  getPublicCourses,
  getPublicCohortsByCourse,
} from "../controllers/public.controllers.js";

const router = express.Router();

router.get("/courses", getPublicCourses);
router.get("/courses/:courseId/cohorts", getPublicCohortsByCourse);

export default router;
