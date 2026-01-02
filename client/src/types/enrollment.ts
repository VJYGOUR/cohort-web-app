// src/types/enrollment.ts
export interface Enrollment {
  _id: string;
  status: "pending" | "paid" | "cancelled";
  cohortId: {
    name: string;
    startDate: string;
    courseId: {
      title: string;
    };
  };
}
