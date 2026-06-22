import { collectionHandlers } from "@/lib/resource-route";
import SubjectService from "@/services/SubjectService";
export const { GET, POST } = collectionHandlers(SubjectService);
