import { Router } from "express";
import authCtrl from "../controllers/authCtrl";

const router = Router();

router.post("/login", authCtrl.login);
router.get("/refresh_token", authCtrl.refreshToken);
router.get("/logout", authCtrl.logout);

export default router;
