import { Router } from "express";
import recurzoCtrl from "../controllers/recurzoCtrl";

const router = Router();

router.post("/addRecurso", recurzoCtrl.addRecurzo);
router.put("/editRecurso/:id", recurzoCtrl.editRecurzo);
router.delete("/deleteRecurso/:id", recurzoCtrl.deleteRecurzo);
router.get("/getAllRecursos", recurzoCtrl.getAllRecurzos);

export default router;
