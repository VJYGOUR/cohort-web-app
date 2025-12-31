// src/pages/public/CourseList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicCourses } from "../services/publicCourse";
import type { Course } from "../types/course";

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getPublicCourses().then((res) => setCourses(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Available Courses</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="border rounded p-4 bg-white shadow">
            <h2 className="text-lg font-medium">{course.title}</h2>
            <p className="text-gray-600 mt-1">{course.description}</p>

            <Link
              to={`/courses/${course._id}`}
              className="text-blue-600 text-sm mt-3 inline-block"
            >
              View Cohorts →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
