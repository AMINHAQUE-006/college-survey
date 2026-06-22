import { AppError } from "@/lib/api";
import CampaignRepository from "@/repositories/CampaignRepository";
import CourseRepository from "@/repositories/CourseRepository";
import { campaignSchema, updateSchemas } from "@/validations";
import CrudService from "./CrudService";
class CampaignService extends CrudService {
  constructor() {
    super(CampaignRepository, campaignSchema, updateSchemas.campaigns);
  }
  async validate(data, excludeId) {
    if (
      data.startDate &&
      data.endDate &&
      new Date(data.endDate) <= new Date(data.startDate)
    )
      throw new AppError("endDate must be after startDate", 422);
    if (data.courseIds) {
      const courses = await Promise.all(
        data.courseIds.map((id) => CourseRepository.findById(id)),
      );
      if (courses.some((c) => !c?.isActive))
        throw new AppError("Every campaign course must be active", 422);
    }
    if (data.isActive && data.courseIds)
      for (const courseId of data.courseIds)
        if (await CampaignRepository.findActiveForCourse(courseId, excludeId))
          throw new AppError(
            "Only one active campaign is allowed per course",
            409,
          );
  }
  async create(input) {
    const data = this.createSchema.parse(input);
    await this.validate(data);
    return this.repository.create(data);
  }
  async update(id, input) {
    const current = await this.get(id);
    const data = this.updateSchema.parse(input);
    const merged = {
      ...current,
      ...data,
      courseIds: data.courseIds || current.courseIds.map(String),
    };
    await this.validate(merged, id);
    return super.update(id, data);
  }
}
export default new CampaignService();
