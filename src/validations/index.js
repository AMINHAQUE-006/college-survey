import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id");
const active = z.boolean().optional();
const text = (min = 2, max = 200) => z.string().trim().min(min).max(max);

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
});
export const adminSchema = z.object({
  name: text(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.literal("admin").default("admin"),
  isActive: active,
});
export const adminUpdateSchema = adminSchema
  .partial()
  .omit({ password: true })
  .extend({ password: z.string().min(8).max(128).optional() });
export const courseSchema = z.object({
  name: text(),
  code: text(2, 20).transform((v) => v.toUpperCase()),
  totalSemesters: z.coerce.number().int().min(1).max(12),
  studentCount: z.coerce.number().int().min(0).optional().default(0),
  isActive: active,
});
export const teacherSchema = z.object({
  name: text(),
  employeeId: text(2, 30).transform((v) => v.toUpperCase()),
  designation: text(),
  department: text(),
  isActive: active,
});
export const subjectSchema = z.object({
  name: text(),
  code: text(2, 30).transform((v) => v.toUpperCase()),
  courseId: objectId,
  semester: z.coerce.number().int().min(1).max(12),
  teacherId: objectId,
  isActive: active,
});
export const campaignSchema = z
  .object({
    title: text(),
    description: z.string().trim().max(2000).optional().default(""),
    courseIds: z.array(objectId).min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isActive: active,
  })
  .refine((v) => v.endDate > v.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });
export const campaignUpdateSchema = z.object({
  title: text().optional(),
  description: z.string().trim().max(2000).optional(),
  courseIds: z.array(objectId).min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isActive: active,
});
export const questionSchema = z.object({
  question: text(5, 500),
  category: z.enum(["infrastructure", "academic", "teacher"]),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: active,
});
const ratingSchema = z.object({
  questionId: objectId,
  rating: z.coerce.number().int().min(1).max(5),
});
const teacherFeedbackSchema = z.object({
  teacherId: objectId,
  subjectId: objectId.optional(),
  ratings: z.array(ratingSchema).min(1),
});
export const feedbackSchema = z
  .object({
    campaignId: objectId,
    courseId: objectId,
    semester: z.coerce.number().int().min(1).max(12),
    infrastructure: z.array(ratingSchema).default([]),
    academic: z.array(ratingSchema).default([]),
    teacherFeedback: z.array(teacherFeedbackSchema).default([]),
    collegeSuggestion: z.string().trim().max(2000).optional().default(""),
    additionalSuggestion: z.string().trim().max(2000).optional().default(""),
    fingerprint: z.string().min(16).max(1000),
  })
  .refine(
    (v) =>
      v.infrastructure.length || v.academic.length || v.teacherFeedback.length,
    { message: "At least one rating is required" },
  );

export const updateSchemas = {
  admins: adminUpdateSchema,
  courses: courseSchema.partial(),
  teachers: teacherSchema.partial(),
  subjects: subjectSchema.partial(),
  campaigns: campaignUpdateSchema,
  questions: questionSchema.partial(),
};
