import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { Role } from "../user/user.interface";
// import geoBlockMiddleware from "../middleware/geoblock.midleware";
import { surveyController } from "./survey.controller";
import geoBlockMiddleware from "../middleware/geoblock.midleware";


const router = Router();

router.get('/get-all-surveys',geoBlockMiddleware,checkAuth(Role.EMPLOYEE), surveyController.getAllSurveys );
router.get('/lootwalls', surveyController.handleLootwallsCallback);

export const SurveyRouter = router;