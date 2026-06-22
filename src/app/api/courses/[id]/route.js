import { itemHandlers } from "@/lib/resource-route";
import CourseService from "@/services/CourseService";
export const { GET, PATCH, DELETE } = itemHandlers(CourseService);
