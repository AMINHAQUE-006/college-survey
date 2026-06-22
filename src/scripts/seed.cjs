const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
console.log("cwd:", process.cwd());
console.log("uri:", process.env.MONGODB_URI);
async function seed() {
  console.log("Connecting...");

  await mongoose.connect("mongodb://localhost:27017/college_feedback");

  console.log("Connected!");

  const Admin =
    mongoose.models.Admin ||
    mongoose.model(
      "Admin",
      new mongoose.Schema(
        {
          name: String,
          email: { type: String, unique: true },
          password: { type: String, select: false },
          role: String,
          isActive: Boolean,
        },
        { timestamps: true },
      ),
    );

  console.log("Checking admin...");

  const email = "amin@praxiaskill.com";

  const exists = await Admin.exists({ email });

  if (exists) {
    console.log("Admin already exists");
  } else {
    await Admin.create({
      name: "Super Admin",
      email,
      password: await bcrypt.hash("Amin@2006", 12),
      role: "admin",
      isActive: true,
    });

    console.log("Admin created successfully");
  }

  await mongoose.disconnect();
}
seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
