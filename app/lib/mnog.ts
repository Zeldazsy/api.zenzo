import mongoose, { Mongoose } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error("Please define MONGODB_URI")

const cached = global.mongooseCache || {
  conn: null,
  promise: null,
}

global.mongooseCache = cached

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "filebin",
      bufferCommands: false,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
