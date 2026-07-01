import { Router } from "express";
import { userRoutes } from "../module/user/user.routes";
import { AuthRouter } from "../module/auth/auth.routes";
import { SurveyRouter } from "../module/survey/survey.routes";
import { zampilaroute } from "../module/survey/ZampillaSurvey/zamplia.routes";

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
    {
        path: "/zampila",
        router: zampilaroute,
    },

];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.router);
});
