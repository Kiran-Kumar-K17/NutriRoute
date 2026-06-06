import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const URI = process.env.MONGO_URI;
    const connectionInstance = await mongoose.connect(URI);
    console.log(
      `MongoDB connected Successfully! Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
