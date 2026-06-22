import Admin from "@/models/Admin";
import BaseRepository from "./BaseRepository";
import { connectDB } from "@/lib/db";

class AdminRepository extends BaseRepository {
  constructor() {
    super(Admin, ["name", "email"]);
  }

  async findByEmail(email, withPassword = false) {
    await connectDB();

    let query = Admin.findOne({
      email: email.toLowerCase(),
    });

    if (withPassword) {
      query = query.select("+password");
    }

    return await query.exec();
  }
}

export default new AdminRepository();
