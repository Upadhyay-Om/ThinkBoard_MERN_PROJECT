import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connected Sucessfully!");
  } catch (error) {
    console.error("Mongodb Connection failed", error);
    process.exit(1); // exit with failure 
  }
};
