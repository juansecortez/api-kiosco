import { Router } from "express";
import queriesCtrl from "../controllers/queriesCtrl";

const router = Router();

router.get("/requestsMadeByID", queriesCtrl.requestsMadeByID);
router.get("/requestsApproved", queriesCtrl.requestsApproved);

export default router;
