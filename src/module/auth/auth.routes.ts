import { Router } from "express";
import passport from "passport";
import { authController } from "./auth.controller";


const router = Router();

router.post('/login', authController.credentialLogin);

export const AuthRouter = router;