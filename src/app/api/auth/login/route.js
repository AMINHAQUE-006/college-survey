import { signIn } from "@/auth";
import { handleApiError, success } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/validations";

export async function POST(request) {
  try {
    rateLimit(request, { limit: 5, windowMs: 60_000 });
    const credentials = loginSchema.parse(await request.json());
    await signIn("credentials", { ...credentials, redirect: false });
    return success({}, "Login successful");
  } catch (error) {
    return handleApiError(error);
  }
}
