import Enrollment from "../models/enrollment.models.js";
import Cohort from "../models/cohort.models.js";

export const createEnrollment = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { cohortId } = req.body;

    // 1️⃣ Cohort exists?
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    // 2️⃣ Enrollment open?
    if (cohort.status !== "enrollment_open") {
      return res
        .status(400)
        .json({ message: "Enrollment is not open for this cohort" });
    }

    const now = new Date();

    if (now < cohort.enrollmentStartDate || now > cohort.enrollmentEndDate) {
      return res.status(400).json({ message: "Enrollment window is closed" });
    }

    // 3️⃣ Capacity check
    const enrolledCount = await Enrollment.countDocuments({
      cohortId,
      status: { $ne: "cancelled" },
    });

    if (enrolledCount >= cohort.capacity) {
      return res.status(400).json({ message: "Cohort is full" });
    }

    // 4️⃣ Create enrollment
    const enrollment = await Enrollment.create({
      userId,
      cohortId,
      status: "pending",
    });

    res.status(201).json(enrollment);
  } catch (error) {
    // Duplicate enrollment (unique index)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this cohort" });
    }

    res.status(500).json({ message: "Enrollment failed" });
  }
};
export const getUserEnrollments = async (req, res) => {
  const userId = req.user.id;

  const enrollments = await Enrollment.find({ userId })
    .populate({
      path: "cohortId",
      select: "name startDate",
      populate: {
        path: "courseId",
        select: "title",
      },
    })
    .sort({ createdAt: -1 });

  res.json(enrollments);
};
