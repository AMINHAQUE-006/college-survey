import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    averageRating: { type: Number, default: 0 },
    totalResponses: { type: Number, default: 0 },
  },
  { timestamps: true },
);
schema.index({ teacherId: 1, campaignId: 1 }, { unique: true });
export default mongoose.models.FeedbackStats ||
  mongoose.model("FeedbackStats", schema);
