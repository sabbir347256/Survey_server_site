import bcryptjs from "bcryptjs";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { userModel } from "../module/user/user.model";


passport.use(
  "user-local",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const isUserExists = await userModel.findOne({ email });

        if (!isUserExists || isUserExists === null) {
          return done(null, false, { message: "User Does not Exist" });
        }

        if (isUserExists.role !== "EMPLOYEE") {
          return done(null, false, {
            message: "Only Admins are allowed to login here. Please use the valid portal.",
          });
        }

        const isPasswordMatch = await bcryptjs.compare(
          password,
          isUserExists?.password as string,
        );

        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect Password" });
        }

        return done(null, isUserExists);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  "admin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const isUserExists = await userModel.findOne({ email });

        if (!isUserExists) {
          return done(null, false, { message: "Agent Account Does not Exist" });
        }

        if (isUserExists.role !== "ADMIN") {
          return done(null, false, {
            message: "This portal is only for Admins.",
          });
        }

        const isPasswordMatch = await bcryptjs.compare(
          password,
          isUserExists?.password as string,
        );

        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect Password" });
        }

        return done(null, isUserExists);
      } catch (error) {
        return done(error);
      }
    },
  ),
);


passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});