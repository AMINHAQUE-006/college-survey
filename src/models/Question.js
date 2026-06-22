import mongoose from "mongoose";
const schema = new mongoose.Schema({ question: { type: String, required: true, trim: true }, category: { type: String, enum: ["infrastructure", "academic", "teacher"], required: true, index: true }, sortOrder: { type: Number, default: 0 }, isActive: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.models.Question || mongoose.model("Question", schema);
