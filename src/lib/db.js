import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const globalCache = globalThis;
const cached =
  globalCache.mongoose ||
  (globalCache.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
