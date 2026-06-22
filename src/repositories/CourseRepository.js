import Course from "@/models/Course";
import BaseRepository from "./BaseRepository";
class CourseRepository extends BaseRepository {
  constructor() {
    super(Course, ["name", "code"]);
  }
}
export default new CourseRepository();
