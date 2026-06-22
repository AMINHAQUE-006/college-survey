import "@/models/Course";
import Campaign from "@/models/Campaign";
import BaseRepository from "./BaseRepository";
class CampaignRepository extends BaseRepository {
  constructor() {
    super(Campaign, ["title", "description"]);
  }
  list(options = {}) {
    return super.list({ ...options, populate: ["courseIds"] });
  }
  async findActiveForCourse(courseId, excludeId) {
    return Campaign.findOne({
      _id: { $ne: excludeId || null },
      courseIds: courseId,
      isActive: true,
    });
  }
}
export default new CampaignRepository();
