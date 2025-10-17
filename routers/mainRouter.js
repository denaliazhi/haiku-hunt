import { Router } from "express";
import mainController from "../controllers/mainController.js";

const router = Router();
router.get("/", mainController.getAll);
router.get("/search", mainController.getSearch);

export default router;
