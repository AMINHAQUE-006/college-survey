import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin"], default: "admin" },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

schema.pre("save", async function () { if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12); });
schema.pre("findOneAndUpdate", async function () { const update = this.getUpdate(); if (update?.password) update.password = await bcrypt.hash(update.password, 12); });
schema.methods.comparePassword = function (password) { return bcrypt.compare(password, this.password); };
export default mongoose.models.Admin || mongoose.model("Admin", schema);
