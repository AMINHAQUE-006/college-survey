import crypto from "node:crypto";
import { AppError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import Campaign from "@/models/Campaign";
import Course from "@/models/Course";
import Feedback from "@/models/Feedback";
import FeedbackStats from "@/models/FeedbackStats";
import FeedbackRepository from "@/repositories/FeedbackRepository";
import { feedbackSchema } from "@/validations";

class FeedbackService {
  list(options) {
    return FeedbackRepository.list(options);
  }
  async get(id) {
    const item = await FeedbackRepository.findById(id, [
      "campaignId",
      "courseId",
      "teacherFeedback.teacherId",
      "teacherFeedback.subjectId",
    ]);
    if (!item) throw new AppError("Feedback not found", 404);
    return item;
  }
  async submit(input) {
    const data = feedbackSchema.parse(input);
    await connectDB();
    const now = new Date();
    const [campaign, course] = await Promise.all([
      Campaign.findOne({
        _id: data.campaignId,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      }).lean(),
      Course.findOne({ _id: data.courseId, isActive: true }).lean(),
    ]);
    if (!campaign) throw new AppError("No active campaign was found", 422);
    if (!course || !campaign.courseIds.some((id) => id.equals(data.courseId)))
      throw new AppError("Course is not part of this campaign", 422);
    if (data.semester > course.totalSemesters)
      throw new AppError("Invalid semester for this course", 422);
    const secret = process.env.FINGERPRINT_SECRET || process.env.AUTH_SECRET;
    if (!secret)
      throw new AppError("Fingerprint security is not configured", 500);
    const fingerprintHash = crypto
      .createHmac("sha256", secret)
      .update(data.fingerprint)
      .digest("hex");
    if (
      await FeedbackRepository.existsForDevice(data.campaignId, fingerprintHash)
    )
      throw new AppError(
        "Feedback has already been submitted from this device for this campaign",
        409,
      );
    const { fingerprint, ...anonymousData } = data;
    const feedback = await Feedback.create({
      ...anonymousData,
      fingerprintHash,
    });
    await Promise.all(
      data.teacherFeedback.map(async (entry) => {
        const rating =
          entry.ratings.reduce((sum, item) => sum + item.rating, 0) /
          entry.ratings.length;
        const current = await FeedbackStats.findOne({
          campaignId: data.campaignId,
          teacherId: entry.teacherId,
        });
        if (!current)
          return FeedbackStats.create({
            campaignId: data.campaignId,
            teacherId: entry.teacherId,
            averageRating: rating,
            totalResponses: 1,
          });
        current.averageRating =
          (current.averageRating * current.totalResponses + rating) /
          (current.totalResponses + 1);
        current.totalResponses += 1;
        return current.save();
      }),
    );
    return { id: feedback.id, submittedAt: feedback.createdAt };
  }
}
export default new FeedbackService();
