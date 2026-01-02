import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserEnrollments } from "../services/enrollment";
import type { Enrollment } from "../types/enrollment";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserEnrollments()
      .then((res) => setEnrollments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Welcome, {user?.name}</h1>

      <p className="mb-6 text-gray-700">You are logged in as a user.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enrollments */}
        <div className="border p-6 rounded bg-white shadow hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-medium mb-4">Your Enrolled Cohorts</h2>

          {loading && (
            <p className="text-gray-500 text-sm">Loading enrollments…</p>
          )}

          {!loading && enrollments.length === 0 && (
            <p className="text-gray-600 text-sm">
              You have not enrolled in any cohorts yet.
            </p>
          )}

          <div className="space-y-3">
            {enrollments.map((e) => (
              <div key={e._id} className="border rounded p-3 bg-gray-50">
                <p className="font-medium">{e.cohortId.courseId.title}</p>

                <p className="text-sm text-gray-600">
                  Cohort: {e.cohortId.name}
                </p>

                <p className="text-sm text-gray-600">
                  Starts: {new Date(e.cohortId.startDate).toDateString()}
                </p>

                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                    e.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {e.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events (future) */}
        <div className="border p-6 rounded bg-white shadow hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-medium mb-2">Upcoming Events</h2>
          <p className="text-gray-600">
            Sessions and events will appear here later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
