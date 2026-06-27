import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { Role } from "../user/user.interface";
import geoBlockMiddleware from "../middleware/geoblock.midleware";
import { surveyController } from "./survey.controller";


const router = Router();

router.get('/get-all-surveys',checkAuth(Role.EMPLOYEE),geoBlockMiddleware, surveyController.getAllSurveys );

export const SurveyRouter = router;