import { AppError } from "@/lib/api";

export default class CrudService {
  constructor(repository, createSchema, updateSchema) {
    this.repository = repository;
    this.createSchema = createSchema;
    this.updateSchema = updateSchema;
  }
  list(options) {
    return this.repository.list(options);
  }
  async get(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new AppError("Record not found", 404);
    return item;
  }
  create(input) {
    return this.repository.create(this.createSchema.parse(input));
  }
  async update(id, input) {
    const item = await this.repository.update(
      id,
      this.updateSchema.parse(input),
    );
    if (!item) throw new AppError("Record not found", 404);
    return item;
  }
  async delete(id) {
    const item = await this.repository.delete(id);
    if (!item) throw new AppError("Record not found", 404);
    return item;
  }
}
