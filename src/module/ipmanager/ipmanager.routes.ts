import { Router } from "express";
import { ipManagerController } from "./ipmanager.controller";

const router = Router();

router.post('/add', ipManagerController.addIP);
router.get('/all', ipManagerController.getAllIPs);
router.put('/status/:id', ipManagerController.updateIPStatus);
router.delete('/delete/:id', ipManagerController.deleteIP);


export const ipManagerRoutes = router;   