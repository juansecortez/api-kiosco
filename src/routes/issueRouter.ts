import { Router } from "express";
import issueCtrl from "../controllers/issueCtrl";

const router = Router();

router.post("/addIssue", issueCtrl.addIssue);
router.put("/editIssue/:id", issueCtrl.editIssue);
router.delete("/deleteIssue/:id", issueCtrl.deleteIssue);
router.get("/getAllIssues", issueCtrl.getAllIssues);
router.get('/issues/:tipo', issueCtrl.getIssuesByType);


export default router;
