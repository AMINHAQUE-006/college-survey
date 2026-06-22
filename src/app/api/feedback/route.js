import { handleApiError, parsePagination, success } from "@/lib/api";
import { requireAdmin } from "@/lib/authorization";
import { rateLimit } from "@/lib/rate-limit";
import FeedbackService from "@/services/FeedbackService";
export async function GET(request) {
  try {
    rateLimit(request);
    await requireAdmin();
    return success(
      await FeedbackService.list(
        parsePagination(new URL(request.url).searchParams),
      ),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
export async function POST(request) {
  try {
    rateLimit(request, { limit: 5, windowMs: 60_000 });
    return success(
      await FeedbackService.submit(await request.json()),
      "Anonymous feedback submitted",
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
