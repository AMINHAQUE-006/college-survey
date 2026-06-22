import { AppError } from "@/lib/api";
import CourseRepository from "@/repositories/CourseRepository";
import SubjectRepository from "@/repositories/SubjectRepository";
import TeacherRepository from "@/repositories/TeacherRepository";
import { subjectSchema, updateSchemas } from "@/validations";
import CrudService from "./CrudService";
class SubjectService extends CrudService {
  constructor() {
    super(SubjectRepository, subjectSchema, updateSchemas.subjects);
  }
  async validateRelations(data) {
    const [course, teacher] = await Promise.all([
      CourseRepository.findById(data.courseId),
      TeacherRepository.findById(data.teacherId),
    ]);
    if (!course || !course.isActive)
      throw new AppError("Active course not found", 404);
    if (!teacher || !teacher.isActive)
      throw new AppError("Active teacher not found", 404);
    if (data.semester > course.totalSemesters)
      throw new AppError("Semester exceeds the course duration", 422);
  }
  async create(input) {
    const data = this.createSchema.parse(input);
    await this.validateRelations(data);
    return this.repository.create(data);
  }
  async update(id, input) {
    const current = await this.get(id);
    const data = this.updateSchema.parse(input);
    await this.validateRelations({
      courseId: data.courseId || current.courseId.toString(),
      teacherId: data.teacherId || current.teacherId.toString(),
      semester: data.semester || current.semester,
    });
    return super.update(id, data);
  }
}
export default new SubjectService();
