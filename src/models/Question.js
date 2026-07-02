import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Teaching",
        "Content",
        "Environment",
        "Support",
        "Other",
        "Teacher",
      ],
      required: true,
      index: true,
    },
    teacherName: {
      type: String,
      trim: true,
      default: "",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Question || mongoose.model("Question", schema);
