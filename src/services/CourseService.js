import CourseRepository from "@/repositories/CourseRepository";
import { courseSchema, updateSchemas } from "@/validations";
import CrudService from "./CrudService";
class CourseService extends CrudService {
  constructor() {
    super(CourseRepository, courseSchema, updateSchemas.courses);
  }
}
export default new CourseService();
