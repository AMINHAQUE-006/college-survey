import { ZodError } from "zod";

export class AppError extends Error {
  constructor(message, status = 400, errors = []) { super(message); this.status = status; this.errors = errors; }
}

export const success = (data = {}, message = "Success", status = 200) =>
  Response.json({ success: true, message, data }, { status });

export const failure = (message, errors = [], status = 400) =>
  Response.json({ success: false, message, errors }, { status });

export function handleApiError(error) {
  if (error instanceof ZodError) return failure("Validation failed", error.issues, 422);
  if (error instanceof AppError) return failure(error.message, error.errors, error.status);
  if (error?.type === "CredentialsSignin") return failure("Invalid email or password", [], 401);
  if (error?.code === 11000) return failure("A record with this value already exists", [error.keyValue], 409);
  console.error(error);
  return failure("Internal server error", [], 500);
}

export const parsePagination = (searchParams) => ({
  page: Math.max(Number(searchParams.get("page")) || 1, 1),
  limit: Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 100),
  search: searchParams.get("search")?.trim() || "",
  isActive: searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined,
  filter: Object.fromEntries(["category", "courseId", "teacherId", "campaignId", "semester"].filter((key) => searchParams.has(key)).map((key) => [key, searchParams.get(key)])),
});
