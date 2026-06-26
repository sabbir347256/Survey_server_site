import mongoose, { Model, Schema } from "mongoose";
import { IUser, Role, Status } from "./user.interface";

const usermodel: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.EMPLOYEE, required: true },
    balance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(Status), default: Status.ACTIVE, required: true },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export const userModel : Model<IUser> = mongoose.model<IUser>('User', usermodel);