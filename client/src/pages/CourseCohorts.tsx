// src/pages/public/CourseCohorts.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicCohortsByCourse } from "../services/publicCourse";
import type { Cohort } from "../types/cohort";

const CourseCohorts = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

  useEffect(() => {
    if (!courseId) return;
    getPublicCohortsByCourse(courseId).then((res) => setCohorts(res.data));
  }, [courseId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Available Cohorts</h1>

      {cohorts.length === 0 && (
        <p className="text-gray-600">No open cohorts right now.</p>
      )}

      <div className="space-y-4">
        {cohorts.map((c) => (
          <div key={c._id} className="border p-4 rounded bg-white shadow">
            <h3 className="font-medium">{c.name}</h3>
            <p className="text-sm text-gray-600">
              Starts on {new Date(c.startDate).toDateString()}
            </p>
            <p className="text-sm">Price: ₹{c.price}</p>

            <button
              disabled
              className="mt-3 bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
            >
              Enroll (Phase 2.2)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCohorts;
