import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/types";


// 2️⃣ Define the schema
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 20 },
});

// 3️⃣ Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 4️⃣ Add method to compare password
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// 5️⃣ Export the model
export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);
