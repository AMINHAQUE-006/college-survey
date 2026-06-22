import QuestionRepository from "@/repositories/QuestionRepository";
import { questionSchema, updateSchemas } from "@/validations";
import CrudService from "./CrudService";
class QuestionService extends CrudService {
  constructor() {
    super(QuestionRepository, questionSchema, updateSchemas.questions);
  }
}
export default new QuestionService();
