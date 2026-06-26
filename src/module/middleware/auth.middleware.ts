import { NextFunction, Request, Response } from "express";
import appError from "../../errorHelper/appError";
import httpStatus from 'http-status-codes';
import { verifyToken } from "../utilitis/jwt";
import envVars from "../../config/envars";
import { JwtPayload } from "jsonwebtoken";
import userModel from "../user/user.model";

export const checkAuth =
  (...restRole: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization as string;
        const accessToken = authHeader.split(" ")[1];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new appError(httpStatus.UNAUTHORIZED, "Token not provided!");
        }

        if (!accessToken) {
          throw new appError(401, "Unauthorized! token must required.");
        }

        const verifyUser = verifyToken(
          accessToken as string,
          envVars.JWT_ACCESS_SECRET,
        ) as JwtPayload;

        if (!verifyUser) {
          throw new appError(httpStatus.UNAUTHORIZED, "Invalid token!");
        }

        const isUser = await userModel.findById(verifyUser?.userId);
        if (!isUser) {
          throw new appError(httpStatus.UNAUTHORIZED, "No user found!");
        }

        // if (
        //   isUser.isActive === IsActive.INACTIVE || isUser.isActive === IsActive.BLOCKED
        // ) {
        //   throw new appError(
        //     httpStatus.FORBIDDEN,
        //     "User is Blocked or Inactive!",
        //   );
        // }

        //   if (isUser?.isDeleted) {
        //     throw new appError(httpStatus.FORBIDDEN, "The user was deleted!");
        //   }

        if (restRole.length && !restRole.includes(verifyUser.role)) {
          throw new appError(
            httpStatus.FORBIDDEN,
            "You are not permitted to access this route!",
          );
        }

        (req as JwtPayload).user  = verifyUser;
        next();
      } catch (error) {
        next(error); 
      }
    };