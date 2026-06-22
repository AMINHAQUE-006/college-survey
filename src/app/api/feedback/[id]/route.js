import { handleApiError, success } from "@/lib/api";
import { requireAdmin } from "@/lib/authorization";
import { rateLimit } from "@/lib/rate-limit";
import FeedbackService from "@/services/FeedbackService";
export async function GET(request, { params }) { try { rateLimit(request); await requireAdmin(); const { id } = await params; return success(await FeedbackService.get(id)); } catch (error) { return handleApiError(error); } }
