import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { type Cohort } from "../../types/admin/cohort";
import { getCohortsByCourse } from "../../services/admin/cohort";

const AdminCohortList = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

  useEffect(() => {
    if (!courseId) return;
    getCohortsByCourse(courseId).then((res) => setCohorts(res.data));
  }, [courseId]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Cohorts</h2>
        <Link
          to={`/admin/courses/${courseId}/cohorts/new`}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          + New Cohort
        </Link>
      </div>

      {cohorts.map((cohort) => (
        <div
          key={cohort._id}
          className="border p-4 rounded bg-white shadow mb-3"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{cohort.name}</h3>
              <p className="text-sm text-gray-600">Status: {cohort.status}</p>
            </div>

            <Link
              to={`/admin/cohorts/${cohort._id}/edit`}
              className="text-blue-600"
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCohortList;
