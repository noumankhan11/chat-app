import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connnectionInstance = await mongoose.connect(
      "mongodb://localhost:27017/chat-app"
    );

    const host = connnectionInstance.connection.host;
    console.log(`/n MongoDB connected !! DB Host : ${host} `);
  } catch (error: any) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDb;
