import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE",
    VENDOR = "VENDOR",
}

export enum Status {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
}

export interface IUser {
     _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: Role;
    balance: number;
    pendingBalance: number;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
};