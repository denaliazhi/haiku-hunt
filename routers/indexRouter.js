import { Router } from "express";
import indexController from "../controllers/indexController.js";

const router = Router();
router.get("/", indexController.getAll);
router.get("/:borough", indexController.getBorough);

export default router;
