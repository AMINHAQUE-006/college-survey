import { collectionHandlers } from "@/lib/resource-route";
import QuestionService from "@/services/QuestionService";
export const { GET, POST } = collectionHandlers(QuestionService);
