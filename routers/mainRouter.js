import { Router } from "express";
import mainController from "../controllers/mainController.js";

const router = Router();
router.get("/", (req, res) => {
  res.redirect("/all");
});
router.get("/all", mainController.getAll);
router.get("/:group", mainController.getSearch);

export default router;
