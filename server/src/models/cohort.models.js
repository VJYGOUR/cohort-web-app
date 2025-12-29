import mongoose from "mongoose";

const cohortSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    name: { type: String, required: true },

    price: { type: Number, required: true },

    capacity: { type: Number, required: true },

    enrolledCount: { type: Number, default: 0 },

    enrollmentStartDate: { type: Date, required: true },
    enrollmentEndDate: { type: Date, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    status: {
      type: String,
      enum: [
        "draft",
        "enrollment_open",
        "enrollment_closed",
        "active",
        "completed",
      ],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cohort", cohortSchema);
