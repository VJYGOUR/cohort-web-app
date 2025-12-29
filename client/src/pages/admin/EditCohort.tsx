import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../axios/axios";
import { updateCohort } from "../../services/cohort";
import { type Cohort } from "../../types/cohort";

/* ---- Types ---- */

type CohortStatus =
  | "draft"
  | "enrollment_open"
  | "enrollment_closed"
  | "active"
  | "completed";

type EditCohortForm = {
  name: string;
  price: number;
  capacity: number;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  startDate: string;
  endDate: string;
  status: CohortStatus;
};

/* ---- Component ---- */

const EditCohort = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cohortStatus, setCohortStatus] = useState<CohortStatus>("draft");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EditCohortForm>();

  /* ---- Load Cohort ---- */
  useEffect(() => {
    if (!id) return;

    const fetchCohort = async () => {
      const res = await api.get<Cohort>(`/admin/cohorts/${id}`);
      const cohort = res.data;

      setCohortStatus(cohort.status);

      reset({
        name: cohort.name,
        price: cohort.price,
        capacity: cohort.capacity,
        enrollmentStartDate: cohort.enrollmentStartDate.slice(0, 10),
        enrollmentEndDate: cohort.enrollmentEndDate.slice(0, 10),
        startDate: cohort.startDate.slice(0, 10),
        endDate: cohort.endDate.slice(0, 10),
        status: cohort.status,
      });
    };

    fetchCohort();
  }, [id, reset]);

  /* ---- Submit ---- */
  const onSubmit: SubmitHandler<EditCohortForm> = async (data) => {
    if (!id) return;

    await updateCohort(id, data);
    navigate(-1); // go back to cohort list
  };

  /* ---- UI ---- */
  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-1">Edit Cohort</h2>
      <p className="text-sm text-gray-600 mb-6">
        Update cohort details. Completed cohorts are locked.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Cohort Name</label>
          <input
            {...register("name", { required: true })}
            className="border p-2 w-full rounded"
            placeholder="e.g. Jan 2025 Batch"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            {...register("price", {
              required: true,
              valueAsNumber: true,
            })}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium mb-1">Capacity</label>
          <input
            type="number"
            {...register("capacity", {
              required: true,
              valueAsNumber: true,
            })}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Enrollment Dates */}
        <div>
          <p className="text-sm font-medium mb-2">Enrollment Period</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              {...register("enrollmentStartDate")}
              className="border p-2 rounded"
            />
            <input
              type="date"
              {...register("enrollmentEndDate")}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Course Dates */}
        <div>
          <p className="text-sm font-medium mb-2">Course Duration</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              {...register("startDate")}
              className="border p-2 rounded"
            />
            <input
              type="date"
              {...register("endDate")}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Cohort Status
          </label>
          <select {...register("status")} className="border p-2 w-full rounded">
            <option value="draft">Draft</option>
            <option value="enrollment_open">Enrollment Open</option>
            <option value="enrollment_closed">Enrollment Closed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            disabled={isSubmitting || cohortStatus === "completed"}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Update Cohort
          </button>

          {cohortStatus === "completed" && (
            <p className="text-xs text-red-600 mt-2">
              Completed cohorts cannot be modified.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditCohort;
