import { itemHandlers } from "@/lib/resource-route";
import TeacherService from "@/services/TeacherService";
export const { GET, PATCH, DELETE } = itemHandlers(TeacherService);
