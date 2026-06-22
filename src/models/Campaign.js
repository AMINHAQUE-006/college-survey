import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    courseIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    ],
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    isActive: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);
schema.index({ courseIds: 1, isActive: 1 });
schema.index(
  { courseIds: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
    name: "one_active_campaign_per_course",
  },
);
export default mongoose.models.Campaign || mongoose.model("Campaign", schema);
