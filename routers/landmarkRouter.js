import { Router } from "express";
import landmarkController from "../controllers/landmarkController.js";
import { isAuth } from "../config/authMiddleware.js";

const router = Router();
router.get("/:id", landmarkController.getDetails);
router.get("/:id/add", landmarkController.getAddClue);
router.post("/:id/add", isAuth, landmarkController.postAddClue);

export default router;
