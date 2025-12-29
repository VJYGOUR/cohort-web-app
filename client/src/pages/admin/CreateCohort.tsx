import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createCohort, type CreateCohortPayload } from "../../services/cohort";

const CreateCohort = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<CreateCohortPayload>({
    defaultValues: { courseId },
  });

  const onSubmit: SubmitHandler<CreateCohortPayload> = async (data) => {
    await createCohort({ ...data, courseId: courseId! });
    navigate(`/admin/courses/${courseId}/cohorts`);
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-1">Create Cohort</h2>
      <p className="text-sm text-gray-600 mb-6">
        A cohort is a time-bound batch of this course.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Cohort Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Cohort Name</label>
          <input
            {...register("name")}
            placeholder="e.g. Jan 2025 Batch"
            className="border p-2 w-full rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used internally and shown to users later.
          </p>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="e.g. 14999"
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium mb-1">Capacity</label>
          <input
            type="number"
            {...register("capacity", { valueAsNumber: true })}
            placeholder="Maximum students"
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Enrollment Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Enrollment Start
            </label>
            <input
              type="date"
              {...register("enrollmentStartDate")}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Enrollment End
            </label>
            <input
              type="date"
              {...register("enrollmentEndDate")}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        {/* Course Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Start Date
            </label>
            <input
              type="date"
              {...register("startDate")}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Course End Date
            </label>
            <input
              type="date"
              {...register("endDate")}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Cohort
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCohort;
