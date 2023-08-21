import { Router } from "express";
import {emailCtrl}  from "../controllers/emailCtrl";

const router = Router();



router.post('/sendemail', emailCtrl.enviar);

export default router;


