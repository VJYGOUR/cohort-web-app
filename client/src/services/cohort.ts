import api from "../axios/axios";
import {type Cohort } from "../types/cohort";

export interface CreateCohortPayload {
  courseId: string;
  name: string;
  price: number;
  capacity: number;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  startDate: string;
  endDate: string;
  status?: string;
}

export const createCohort = (data: CreateCohortPayload) =>
  api.post<Cohort>("/admin/cohorts", data);

export const getCohortsByCourse = (courseId: string) =>
  api.get<Cohort[]>(`/admin/cohorts?courseId=${courseId}`);

export const updateCohort = (id: string, data: Partial<CreateCohortPayload>) =>
  api.put<Cohort>(`/admin/cohorts/${id}`, data);
