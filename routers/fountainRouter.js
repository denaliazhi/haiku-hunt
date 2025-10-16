import { Router } from "express";
import fountainController from "../controllers/fountainController.js";

const router = Router();
router.get("/:id", fountainController.getDetails);

export default router;
