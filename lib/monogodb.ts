import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to MongoDB")

    } catch (error) {
        console.log("Error in connecting to MongoDB: ", error)
    }
}