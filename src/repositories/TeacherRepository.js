import Teacher from "@/models/Teacher";
import BaseRepository from "./BaseRepository";
class TeacherRepository extends BaseRepository {
  constructor() {
    super(Teacher, ["name", "employeeId", "department", "designation"]);
  }
}
export default new TeacherRepository();
