import { collectionHandlers } from "@/lib/resource-route";
import TeacherService from "@/services/TeacherService";
export const { GET, POST } = collectionHandlers(TeacherService);
