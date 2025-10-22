import { Router } from "express";
import mainController from "../controllers/mainController.js";

const router = Router();

router.get("/", (req, res) => {
  res.redirect("/all");
});
router.get("/all", mainController.getAll);

router.get("/sign-up", mainController.getSignUp);
router.post("/sign-up", mainController.postSignUp);
router.get("/sign-in", mainController.getSignIn);
router.post("/sign-in", mainController.postSignIn);
router.get("/sign-out", mainController.getSignOut);

router.get("/about", mainController.getAbout);

export default router;
