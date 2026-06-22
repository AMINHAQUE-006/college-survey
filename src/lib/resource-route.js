import { handleApiError, parsePagination, success } from "./api";
import { requireAdmin } from "./authorization";
import { rateLimit } from "./rate-limit";

export function collectionHandlers(service, { publicRead = true } = {}) {
  return {
    async GET(request) { try { rateLimit(request); if (!publicRead) await requireAdmin(); return success(await service.list(parsePagination(new URL(request.url).searchParams))); } catch (error) { return handleApiError(error); } },
    async POST(request) { try { rateLimit(request, { limit: 30 }); await requireAdmin(); return success(await service.create(await request.json()), "Created successfully", 201); } catch (error) { return handleApiError(error); } },
  };
}

export function itemHandlers(service, { publicRead = true } = {}) {
  return {
    async GET(request, { params }) { try { rateLimit(request); if (!publicRead) await requireAdmin(); const { id } = await params; return success(await service.get(id)); } catch (error) { return handleApiError(error); } },
    async PATCH(request, { params }) { try { rateLimit(request, { limit: 30 }); await requireAdmin(); const { id } = await params; return success(await service.update(id, await request.json()), "Updated successfully"); } catch (error) { return handleApiError(error); } },
    async DELETE(request, { params }) { try { rateLimit(request, { limit: 20 }); await requireAdmin(); const { id } = await params; return success(await service.delete(id), "Deleted successfully"); } catch (error) { return handleApiError(error); } },
  };
}
