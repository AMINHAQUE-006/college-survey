import AdminRepository from "@/repositories/AdminRepository";
import { adminSchema, adminUpdateSchema } from "@/validations";
import CrudService from "./CrudService";
class AdminService extends CrudService {
  constructor() {
    super(AdminRepository, adminSchema, adminUpdateSchema);
  }
}
export default new AdminService();
