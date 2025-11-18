"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        // Event listeners
        mongoose_1.default.connection.on("connected", () => console.log("✅ MongoDB connected successfully"));
        mongoose_1.default.connection.on("error", (err) => console.error("❌ MongoDB connection error:", err));
        // Connect to MongoDB (no extra options needed in Mongoose 7+)
        await mongoose_1.default.connect(process.env.MONGODB_URI);
    }
    catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // stop server if DB fails
    }
};
exports.connectDB = connectDB;
