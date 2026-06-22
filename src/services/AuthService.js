import { AppError } from "@/lib/api";
import AdminRepository from "@/repositories/AdminRepository";
import { loginSchema } from "@/validations";

class AuthService {
  async authenticate(input) {
    const { email, password } = loginSchema.parse(input);
    // console.log("EMAIL : ", email, password);
    const admin = await AdminRepository.findByEmail(email, true);
    if (!admin || !admin.isActive || !(await admin.comparePassword(password)))
      throw new AppError("Invalid email or password", 401);
    admin.lastLogin = new Date();
    await admin.save();
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  }
}
export default new AuthService();
