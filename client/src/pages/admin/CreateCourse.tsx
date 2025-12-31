import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../services/admin/course";
import type { CreateCoursePayload } from "../../services/admin/course";

const CreateCourse = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCoursePayload>({
    defaultValues: { status: "draft" },
  });

  const onSubmit: SubmitHandler<CreateCoursePayload> = async (data) => {
    await createCourse(data);
    navigate("/admin/courses");
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Course</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-600 text-sm">{errors.title.message}</p>
        )}

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          {...register("description", { required: true })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Certificate Title"
          {...register("certificateTitle", { required: true })}
        />

        <select className="w-full border p-2 rounded" {...register("status")}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
