import api from "../axios/axios";
import type { Course } from "../types/course";

export interface CreateCoursePayload {
  title: string;
  description: string;
  certificateTitle: string;
  status?: "draft" | "published";
  thumbnail?: string;
}

export const createCourse = (data: CreateCoursePayload) =>
  api.post<Course>("/admin/courses", data);

export const getAdminCourses = () => api.get<Course[]>("/admin/courses");

export const updateCourse = (id: string, data: Partial<CreateCoursePayload>) =>
  api.put<Course>(`/admin/courses/${id}`, data);
