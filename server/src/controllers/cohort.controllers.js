import Cohort from "../models/cohort.models.js";
import Course from "../models/course.models.js";

/**
 * CREATE cohort
 */

export const createCohort = async (req, res) => {
  const {
    courseId,
    name,
    price,
    capacity,
    enrollmentStartDate,
    enrollmentEndDate,
    startDate,
    endDate,
  } = req.body;

  // 1️⃣ Course must exist
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // 2️⃣ Date validation
  if (new Date(enrollmentStartDate) >= new Date(enrollmentEndDate)) {
    return res.status(400).json({ message: "Invalid enrollment dates" });
  }

  if (new Date(enrollmentEndDate) > new Date(startDate)) {
    return res.status(400).json({
      message: "Enrollment must end before cohort starts",
    });
  }

  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ message: "Invalid cohort duration" });
  }

  const cohort = await Cohort.create({
    courseId,
    name,
    price,
    capacity,
    enrollmentStartDate,
    enrollmentEndDate,
    startDate,
    endDate,
  });

  res.status(201).json(cohort);
};

export const getCohortsByCourse = async (req, res) => {
  try {
    const { courseId } = req.query;

    const cohorts = await Cohort.find({ courseId })
      .populate("courseId", "title")
      .sort({ startDate: 1 });
    console.log(cohorts);
    res.json(cohorts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cohorts" });
  }
};
export const updateCohort = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const cohort = await Cohort.findById(id);
  if (!cohort) {
    return res.status(404).json({ message: "Cohort not found" });
  }

  // ❌ Cannot modify completed cohort
  if (cohort.status === "completed") {
    return res
      .status(400)
      .json({ message: "Completed cohort cannot be edited" });
  }

  // ❌ Invalid status jump
  const allowedTransitions = {
    draft: ["enrollment_open"],
    enrollment_open: ["enrollment_closed"],
    enrollment_closed: ["active"],
    active: ["completed"],
  };

  if (
    updates.status &&
    !allowedTransitions[cohort.status]?.includes(updates.status)
  ) {
    return res.status(400).json({
      message: `Invalid status transition from ${cohort.status}`,
    });
  }

  Object.assign(cohort, updates);
  await cohort.save();

  res.json(cohort);
};
export const enrollUser = async (req, res) => {
  const { cohortId } = req.body;
  const userId = req.user.id;

  const cohort = await Cohort.findById(cohortId);
  if (!cohort) {
    return res.status(404).json({ message: "Cohort not found" });
  }

  if (cohort.status !== "enrollment_open") {
    return res.status(400).json({ message: "Enrollment is not open" });
  }

  if (cohort.enrolledCount >= cohort.capacity) {
    cohort.status = "enrollment_closed";
    await cohort.save();
    return res.status(400).json({ message: "Cohort is full" });
  }

  cohort.enrolledCount += 1;

  if (cohort.enrolledCount === cohort.capacity) {
    cohort.status = "enrollment_closed";
  }

  await cohort.save();

  res.json({ message: "Enrollment successful" });
};
