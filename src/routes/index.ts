import { Router } from "express";
import { userRoutes } from "../module/user/user.routes";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        router: userRoutes,
    }

];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.router);
});
