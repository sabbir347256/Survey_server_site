import { Router } from "express";
import { userRoutes } from "../module/user/user.routes";
import { AuthRouter } from "../module/auth/auth.routes";
import { SurveyRouter } from "../module/survey/survey.routes";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        router: userRoutes,
    },
    {
        path: "/auth",
        router: AuthRouter,
    },
    {
        path: "/survey",
        router: SurveyRouter,
    },

];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.router);
});
