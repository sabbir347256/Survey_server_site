import { Router } from 'express';
import {  startSurvey, syncSurveys } from './Zamplia.controller';

const router = Router();

router.get('/surveys/sync', syncSurveys);
router.post('/surveys/start', startSurvey);
// router.get('/surveys/callback', handleExitCallback);

export const zampilaroute = router;