import { Router } from "express";
import {emailCtrl}  from "../controllers/emailCtrl";

const router = Router();



router.post('/sendemail', emailCtrl.enviar);
router.post('/sendemail1', emailCtrl.enviar2);
export default router;


