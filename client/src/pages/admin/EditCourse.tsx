import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { type Course } from "../../types/course";
import { getAdminCourses, updateCourse } from "../../services/course";

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<Course>();

  useEffect(() => {
    getAdminCourses().then((res) => {
      const course = res.data.find((c) => c._id === id);
      if (course) reset(course);
    });
  }, [id, reset]);

  const onSubmit: SubmitHandler<Course> = async (data) => {
    await updateCourse(id!, data);
    navigate("/admin/courses");
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Course</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input className="w-full border p-2" {...register("title")} />
        <textarea className="w-full border p-2" {...register("description")} />
        <input
          className="w-full border p-2"
          {...register("certificateTitle")}
        />

        <select className="w-full border p-2" {...register("status")}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
