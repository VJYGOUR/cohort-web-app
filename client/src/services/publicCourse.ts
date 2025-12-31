// src/services/public.ts
import api from "../axios/axios";
import type { Course } from "../types/course";
import type { Cohort } from "../types/cohort";

export const getPublicCourses = () => api.get<Course[]>("/courses");

export const getPublicCohortsByCourse = (courseId: string) =>
  api.get<Cohort[]>(`/courses/${courseId}/cohorts`);
