export type CohortStatus =
  | "draft"
  | "enrollment_open"
  | "enrollment_closed"
  | "active"
  | "completed";

export interface Cohort {
  _id: string;
  courseId: {
    _id: string;
    title: string;
  };
  name: string;
  price: number;
  capacity: number;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  startDate: string;
  endDate: string;
  status: CohortStatus;
}
