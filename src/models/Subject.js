import mongoose from "mongoose";
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, code: { type: String, required: true, unique: true, uppercase: true, trim: true }, courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true }, semester: { type: Number, required: true, min: 1 }, teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true, index: true }, isActive: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.models.Subject || mongoose.model("Subject", schema);
