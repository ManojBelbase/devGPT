import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Event listeners
        mongoose.connection.on("connected", () => console.log("✅ MongoDB connected successfully"));
        mongoose.connection.on("error", (err) => console.error("❌ MongoDB connection error:", err));

        // Connect to MongoDB (no extra options needed in Mongoose 7+)
        await mongoose.connect(process.env.MONGODB_URI!);

    } catch (error: any) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // stop server if DB fails
    }
};
