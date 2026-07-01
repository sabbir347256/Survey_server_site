import { Router } from 'express';
import { startSurvey, syncSurveys, handleExitCallback } from './Zamplia.controller';
import geoBlockMiddleware from '../../middleware/geoblock.midleware';

const router = Router();

router.get('/surveys/sync', syncSurveys);
router.post('/surveys/start', startSurvey);
router.get('/surveys/callback', handleExitCallback);

export const zampilaroute = router;