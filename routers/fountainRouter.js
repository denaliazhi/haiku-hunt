import { Router } from "express";
import fountainController from "../controllers/fountainController.js";

const router = Router();
router.get("/:id", fountainController.getDetails);
router.get("/:id/add", fountainController.getAddClue);
router.post("/:id/add", fountainController.postAddClue);

export default router;
