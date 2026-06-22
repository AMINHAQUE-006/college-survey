import { itemHandlers } from "@/lib/resource-route";
import AdminService from "@/services/AdminService";
export const { GET, PATCH, DELETE } = itemHandlers(AdminService, {
  publicRead: false,
});
