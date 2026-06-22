import TeacherRepository from "@/repositories/TeacherRepository";
import { teacherSchema, updateSchemas } from "@/validations";
import CrudService from "./CrudService";
class TeacherService extends CrudService {
  constructor() {
    super(TeacherRepository, teacherSchema, updateSchemas.teachers);
  }
}
export default new TeacherService();
