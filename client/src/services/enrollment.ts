import api from "../axios/axios";
import type { Enrollment } from "../types/enrollment";
export interface CreateEnrollmentResponse {
  _id: string;
  status: "pending";
  cohortId: string;
}

export const createEnrollment = (cohortId: string) => {
  return api.post<CreateEnrollmentResponse>("/enrollments", {
    cohortId,
  });
};

export const getUserEnrollments = () => {
  return api.get<Enrollment[]>("/enrollments/user/enrollments");
};
