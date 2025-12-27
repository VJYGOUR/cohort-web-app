const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <p className="mb-6 text-gray-700">
        Manage courses, cohorts, and enrollments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border p-6 rounded bg-white shadow hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-medium mb-2">Courses</h2>
          <p className="text-gray-600">
            Placeholder: List of courses will appear here.
          </p>
        </div>

        <div className="border p-6 rounded bg-white shadow hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-medium mb-2">Cohorts</h2>
          <p className="text-gray-600">
            Placeholder: List of cohorts will appear here.
          </p>
        </div>

        <div className="border p-6 rounded bg-white shadow hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-medium mb-2">Enrollments</h2>
          <p className="text-gray-600">
            Placeholder: List of enrollments will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
