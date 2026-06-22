import { collectionHandlers } from "@/lib/resource-route";
import CourseService from "@/services/CourseService";
export const { GET, POST } = collectionHandlers(CourseService);
