import Question from "@/models/Question";
import BaseRepository from "./BaseRepository";
class QuestionRepository extends BaseRepository { constructor() { super(Question, ["question"]); } }
export default new QuestionRepository();
