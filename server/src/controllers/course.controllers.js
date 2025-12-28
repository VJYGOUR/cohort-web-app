import Course from "../models/course.models.js";

/**
 * Create Course
 */

export const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, certificateTitle, status } =
      req.body;

    // Basic validation
    if (!title || !description || !certificateTitle) {
      return res.status(400).json({
        message: "Title, description and certificateTitle are required",
      });
    }

    if (status && !["draft", "published"].includes(status)) {
      return res.status(400).json({ message: "Invalid course status" });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail,
      certificateTitle,
      status: status || "draft",
      createdBy: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course" });
  }
};

/**
 * Get all courses (admin)
 */
export const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/**
 * Update course
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status && !["draft", "published"].includes(updates.status)) {
      return res.status(400).json({ message: "Invalid course status" });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    Object.assign(course, updates);
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to update course" });
  }
};
export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" }).select(
      "title description thumbnail certificateTitle"
    );

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};
