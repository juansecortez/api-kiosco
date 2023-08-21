import { Router } from "express";
import makeRequestCtrl from "../controllers/makeRequestCtrl";

const router = Router();

router.post("/userResgistration", makeRequestCtrl.userResgistration);
router.post("/accessSystems", makeRequestCtrl.accessSystems);
router.post("/accessResource", makeRequestCtrl.computerResource);
router.post("/accessFolder", makeRequestCtrl.folderAccess);
router.post("/accessDatabase", makeRequestCtrl.databaseAccess);
router.post("/internetAccess", makeRequestCtrl.internetAccess);

export default router;
