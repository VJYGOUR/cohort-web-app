import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Course } from "../../types/course";
import { getAdminCourses } from "../../services/course";

const AdminCourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getAdminCourses().then((res) => setCourses(res.data));
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Courses</h2>
        <Link
          to="/admin/courses/new"
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          + New Course
        </Link>
      </div>

      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course._id} className="border p-4 rounded bg-white shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-600">Status: {course.status}</p>
              </div>

              <Link
                to={`/admin/courses/${course._id}/edit`}
                className="text-blue-600"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCourseList;
