export type CourseStatus = "draft" | "published";

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  certificateTitle: string;
  status: CourseStatus;
  createdAt: string;
}
