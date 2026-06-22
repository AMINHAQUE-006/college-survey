import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false },
);
const teacherFeedbackSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    ratings: { type: [ratingSchema], required: true },
  },
  { _id: false },
);
const schema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    semester: { type: Number, required: true, min: 1, index: true },
    infrastructure: { type: [ratingSchema], default: [] },
    academic: { type: [ratingSchema], default: [] },
    teacherFeedback: { type: [teacherFeedbackSchema], default: [] },
    collegeSuggestion: { type: String, maxlength: 2000, default: "" },
    additionalSuggestion: { type: String, maxlength: 2000, default: "" },
    fingerprintHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);
schema.index({ fingerprintHash: 1, campaignId: 1 }, { unique: true });
schema.index({ campaignId: 1, courseId: 1, semester: 1, createdAt: -1 });
export default mongoose.models.Feedback || mongoose.model("Feedback", schema);
