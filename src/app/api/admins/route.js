import { collectionHandlers } from "@/lib/resource-route";
import AdminService from "@/services/AdminService";
export const { GET, POST } = collectionHandlers(AdminService, {
  publicRead: false,
});
