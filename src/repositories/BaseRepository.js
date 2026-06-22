import { connectDB } from "@/lib/db";

export default class BaseRepository {
  constructor(model, searchFields = []) {
    this.model = model;
    this.searchFields = searchFields;
  }
  async list({
    page = 1,
    limit = 20,
    search = "",
    isActive,
    filter = {},
    populate = [],
  } = {}) {
    await connectDB();
    const query = { ...filter };
    if (typeof isActive === "boolean") query.isActive = isActive;
    if (search && this.searchFields.length)
      query.$or = this.searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    const [items, total] = await Promise.all([
      this.model
        .find(query)
        .populate(populate)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query),
    ]);
    return {
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
  async findById(id, populate = []) {
    await connectDB();
    return this.model.findById(id).populate(populate).lean();
  }
  async create(data) {
    await connectDB();
    return this.model.create(data);
  }
  async update(id, data) {
    await connectDB();
    return this.model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .lean();
  }
  async delete(id) {
    await connectDB();
    return this.model.findByIdAndDelete(id).lean();
  }
}
