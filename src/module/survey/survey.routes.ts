import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { Role } from "../user/user.interface";
import { surveyController } from "./survey.controller";


const router = Router();

router.get('/get-all-surveys',checkAuth(Role.EMPLOYEE), surveyController.getAllSurveys );
router.post('/lootwalls', surveyController.handleLootwallsCallback);

export const SurveyRouter = router;