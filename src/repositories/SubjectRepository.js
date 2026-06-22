import "@/models/Course";
import "@/models/Teacher";
import Subject from "@/models/Subject";
import BaseRepository from "./BaseRepository";
class SubjectRepository extends BaseRepository {
  constructor() {
    super(Subject, ["name", "code"]);
  }
  list(options = {}) {
    return super.list({ ...options, populate: ["courseId", "teacherId"] });
  }
}
export default new SubjectRepository();
