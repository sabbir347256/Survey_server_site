import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";

const userModel: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    balance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userModel);