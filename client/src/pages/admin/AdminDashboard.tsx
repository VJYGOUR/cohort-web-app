import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <p className="mb-6 text-gray-700">
        Manage courses, cohorts, and enrollments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Courses */}
        <Link
          to="/admin/courses"
          className="border p-6 rounded bg-white shadow hover:shadow-lg transition-shadow block"
        >
          <h2 className="text-lg font-medium mb-2">Courses</h2>
          <p className="text-gray-600">Create, edit, and publish courses.</p>
        </Link>

        {/* Cohorts (future) */}
        <div className="border p-6 rounded bg-white shadow opacity-50 cursor-not-allowed">
          <h2 className="text-lg font-medium mb-2">Cohorts</h2>
          <p className="text-gray-600">
            Available after course setup (Phase 1.2).
          </p>
        </div>

        {/* Enrollments (future) */}
        <div className="border p-6 rounded bg-white shadow opacity-50 cursor-not-allowed">
          <h2 className="text-lg font-medium mb-2">Enrollments</h2>
          <p className="text-gray-600">Available in Phase 2.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
