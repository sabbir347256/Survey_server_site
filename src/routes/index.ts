import { Router } from "express";
import { userRoutes } from "../module/user/user.routes";
import { AuthRouter } from "../module/auth/auth.routes";

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

];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.router);
});
