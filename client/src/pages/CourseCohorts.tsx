// src/pages/public/CourseCohorts.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { getPublicCohortsByCourse } from "../services/publicCourse";
import type { Cohort } from "../types/cohort";
import api from "../axios/axios";

type ApiError = {
  message: string;
};

const CourseCohorts = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    getPublicCohortsByCourse(courseId).then((res) => setCohorts(res.data));
  }, [courseId]);

  const handleEnroll = async (cohortId: string) => {
    setMessage(null);
    setLoadingId(cohortId);

    try {
      await api.post("/enrollments", { cohortId });
      setMessage("✅ Enrollment requested successfully");
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      // ❌ Not logged in
      if (error.response?.status === 401) {
        setMessage("Please login or signup to enroll.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // ❌ Known backend error
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
        return;
      }

      // ❌ Fallback
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Available Cohorts</h1>

      {message && (
        <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800">
          {message}
        </div>
      )}

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
              onClick={() => handleEnroll(c._id)}
              disabled={loadingId === c._id}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loadingId === c._id ? "Enrolling..." : "Enroll"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCohorts;
