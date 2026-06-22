import { handleApiError, success } from "@/lib/api";
import { requireAdmin } from "@/lib/authorization";
import AnalyticsService from "@/services/AnalyticsService";
export async function GET() {
  try {
    await requireAdmin();
    return success(await AnalyticsService.teachers());
  } catch (error) {
    return handleApiError(error);
  }
}
