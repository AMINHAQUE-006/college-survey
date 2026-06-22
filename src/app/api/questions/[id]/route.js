import { itemHandlers } from "@/lib/resource-route";
import QuestionService from "@/services/QuestionService";
export const { GET, PATCH, DELETE } = itemHandlers(QuestionService);
