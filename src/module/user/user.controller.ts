import { Request, Response } from "express";
import { userModel } from "./user.model";
import { Status } from "./user.interface";
import bcrypt from "bcryptjs";
import { utils } from "../utilitis/utils";
import statusCodes from "http-status-codes";
import appError from "../../errorHelper/appError";

const createEmployee = async (req: Request, res: Response) => {
    console.log('adf')
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            throw new appError(statusCodes.BAD_REQUEST, "All fields are required");
        }

        if (role !== "EMPLOYEE" && role !== "VENDOR") {
            throw new appError(statusCodes.BAD_REQUEST, "Invalid account role specified");
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            throw new appError(statusCodes.BAD_REQUEST, "User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role,
            balance: 0,
            pendingBalance: 0,
            status: Status.ACTIVE
        });

        return utils.sendResponse(res, {
            statusCode: statusCodes.CREATED,
            success: true,
            message: `${role === "VENDOR" ? "Vendor" : "Employee"} account created successfully`,
            data: newUser
        });

    } catch (error: any) {
        throw new appError(statusCodes.INTERNAL_SERVER_ERROR, error.message || "Internal server error occurred");
    }
};

export const userController = {
    createEmployee
};