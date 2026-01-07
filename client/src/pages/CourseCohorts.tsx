// src/pages/public/CourseCohorts.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { getPublicCohortsByCourse } from "../services/publicCourse";
import type { Cohort } from "../types/cohort";
import api from "../axios/axios";
import PaymentButton from "../components/PaymentButton";

type ApiError = {
  message: string;
};

type EnrollmentMap = {
  [cohortId: string]: string; // cohortId -> enrollmentId
};

const CourseCohorts = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentMap>({});

  useEffect(() => {
    if (!courseId) return;
    getPublicCohortsByCourse(courseId).then((res) => setCohorts(res.data));
  }, [courseId]);

  /* ---------------- ENROLL ---------------- */

  const handleEnroll = async (cohortId: string) => {
    setMessage(null);
    setLoadingId(cohortId);

    try {
      const res = await api.post("/enrollments", { cohortId });

      setEnrollments((prev) => ({
        ...prev,
        [cohortId]: res.data._id,
      }));

      setMessage("✅ Enrollment requested. Please complete payment.");
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      if (error.response?.status === 401) {
        setMessage("Please login or signup to enroll.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* ---------------- UI ---------------- */

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
        {cohorts.map((c) => {
          const enrollmentId = enrollments[c._id];

          return (
            <div key={c._id} className="border p-4 rounded bg-white shadow">
              <h3 className="font-medium">{c.name}</h3>
              <p className="text-sm text-gray-600">
                Starts on {new Date(c.startDate).toDateString()}
              </p>
              <p className="text-sm">Price: ₹{c.price}</p>

              {!enrollmentId ? (
                <button
                  onClick={() => handleEnroll(c._id)}
                  disabled={loadingId === c._id}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loadingId === c._id ? "Enrolling..." : "Enroll"}
                </button>
              ) : (
                <PaymentButton enrollmentId={enrollmentId} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseCohorts;
