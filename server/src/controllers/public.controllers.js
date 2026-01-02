// controllers/public.controller.js
import Course from "../models/course.models.js";
import Cohort from "../models/cohort.models.js";

export const getPublicCourses = async (req, res) => {
  const courses = await Course.find({ status: "published" })
    .select("title description thumbnail")
    .sort({ createdAt: -1 });

  res.json(courses);
};

export const getPublicCohortsByCourse = async (req, res) => {
  const { courseId } = req.params;
  const now = new Date();

  const cohorts = await Cohort.find({
    courseId,
    status: "enrollment_open",
    enrollmentStartDate: { $lte: now },
    enrollmentEndDate: { $gte: now },
  }).select("name price startDate capacity");
  console.log(cohorts);
  res.json(cohorts);
};
