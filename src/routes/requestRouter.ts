import { Router } from "express";
import requestCtrl from "../controllers/requestCtrl";

const router = Router();

router.put("/authorize/:id/:authorizedBy", requestCtrl.authorizeRequestHandler);
router.put("/reject/:id/:rejectedBy", requestCtrl.rejectRequestHandler);
router.put("/markAsDone/:id/:doneBy", requestCtrl.markAsDone);


export default router;
