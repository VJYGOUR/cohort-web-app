import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cohortId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ❌ Prevent duplicate enrollment at DB level
enrollmentSchema.index({ userId: 1, cohortId: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
