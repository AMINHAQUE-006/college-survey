import { itemHandlers } from "@/lib/resource-route";
import SubjectService from "@/services/SubjectService";
export const { GET, PATCH, DELETE } = itemHandlers(SubjectService);
