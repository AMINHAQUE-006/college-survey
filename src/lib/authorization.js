import { auth } from "@/auth";
import { AppError } from "./api";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") throw new AppError("Admin authentication required", 401);
  return session.user;
}
