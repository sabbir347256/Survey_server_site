import { NextFunction, Request, Response } from "express";
import passport from "passport";
import appError from "../../errorHelper/appError";
import { createUserToken } from "../utilitis/createUserToken";
import { setAuthCookies } from "../utilitis/setCookies";
import { utils } from "../utilitis/utils";
import httpStatus from "http-status-codes";

const credentialLogin = async (req: Request, res: Response, next: NextFunction) => {
   
    passport.authenticate("user-local", { session: false }, async (err: any, user: any, info: any) => {

        try {
            if (err) {
                console.log("-> Redirected to Error block");
                return next(new appError(500, err.message || err));
            }

            if (!user) {
                console.log("-> User validation failed. Message:", info?.message);
                return utils.sendResponse(res, {
                    statusCode: httpStatus.UNAUTHORIZED,
                    message: info?.message || "Login failed",
                    success: false,
                    data: null
                });
            }


            const userTokens = await createUserToken(user);
            const { password: pass, ...rest } = user.toObject();

            setAuthCookies(res, userTokens);

            return utils.sendResponse(res, {
                statusCode: httpStatus.OK,
                message: "User Login Successfully",
                success: true,
                data: {
                    accessToken: userTokens.accessToken,
                    refreshToken: userTokens.refreshToken,
                    user: rest,
                },
            });
        } catch (error) {
            console.log("-> Caught error inside try-catch:", error);
            return next(error);
        }
    })(req, res, next);
};

const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("admin", async (err: any, user: any, info: any) => {
        try {
            if (err) {
                return next(new appError(401, err));
            }

            if (!user) {
                return utils.sendResponse(res, {
                    statusCode: httpStatus.UNAUTHORIZED,
                    message: info?.message || "Login failed",
                    success: false,
                    data: null
                });
            }

            // if (user.isApproved === false) {
            //   return next(
            //     new appError(
            //       401,
            //       "You will be able to log in after the admin approves your account."
            //     )
            //   );
            // }

            const userTokens = await createUserToken(user);
            const { password: pass, ...rest } = user.toObject();

            setAuthCookies(res, userTokens);

            return utils.sendResponse(res, {
                statusCode: httpStatus.OK,
                message: "User Login Successfully",
                success: true,
                data: {
                    accessToken: userTokens.accessToken,
                    refreshToken: userTokens.refreshToken,
                    user: rest,
                },
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
};

export const authController = {
    credentialLogin,
    adminLogin,
};