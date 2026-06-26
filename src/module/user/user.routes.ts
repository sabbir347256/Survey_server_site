import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post('/create-employee', userController.createEmployee);


export const userRoutes = router;   