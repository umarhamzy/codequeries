import mongoose from "mongoose";

let pendingConnection: Promise<typeof mongoose> | undefined;

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const url = process.env.MONGODB_URL;
  if (!url) {
    throw new Error("MISSING MONGODB_URL");
  }

  mongoose.set("strictQuery", true);
  mongoose.set("bufferCommands", false);

  pendingConnection ??= mongoose
    .connect(url, {
      dbName: "dev-overflow",
      serverSelectionTimeoutMS: 5_000,
    })
    .finally(() => {
      pendingConnection = undefined;
    });

  await pendingConnection;
};
