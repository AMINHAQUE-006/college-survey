import "@/models/Campaign";
import "@/models/Course";
import Feedback from "@/models/Feedback";
import BaseRepository from "./BaseRepository";
class FeedbackRepository extends BaseRepository {
  constructor() {
    super(Feedback);
  }
  list(options = {}) {
    return super.list({
      ...options,
      populate: [
        "campaignId",
        "courseId",
        "teacherFeedback.teacherId",
        "teacherFeedback.subjectId",
      ],
    });
  }
  async existsForDevice(campaignId, fingerprintHash) {
    return Feedback.exists({ campaignId, fingerprintHash });
  }
}
export default new FeedbackRepository();
