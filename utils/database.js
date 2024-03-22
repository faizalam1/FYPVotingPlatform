import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB,
    });
    isConnected = true;
    console.log("Database connected");
  } catch (err) {
    console.error("Error connecting to database: ", err);
    throw err;
  }
};
