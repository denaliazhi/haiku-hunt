import { Router } from "express";
import accountController from "../controllers/accountController.js";
import { isAuth } from "../config/authMiddleware.js";

const router = Router();

router.get("/", isAuth, accountController.getDashboard);
router.post("/delete/:clueid", isAuth, accountController.postDeleteClue);

export default router;
