import mongoose from "mongoose";

// In serverless environments (Vercel), a new function invocation can reuse
// the same process between requests. We cache the connection on `global`
// so repeated invocations don't open a new MongoDB connection every time,
// which would quickly exhaust your connection pool.
let cached = global._mongooseConnection;

if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Failed:", error.message);
    throw error; // don't process.exit() in serverless — that would crash the function
  }

  return cached.conn;
};

export default connectDB;
