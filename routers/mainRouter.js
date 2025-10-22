import { Router } from "express";
import mainController from "../controllers/mainController.js";
import { isAuth } from "../config/authMiddleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.redirect("/all");
});

router.get("/sign-up", mainController.getSignUp);
router.post("/sign-up", mainController.postSignUp);
router.get("/sign-in", mainController.getSignIn);
router.post("/sign-in", mainController.postSignIn);
router.get("/sign-out", mainController.getSignOut);

router.get("/account", isAuth, mainController.getDashboard);

router.get("/about", mainController.getAbout);

// TO DO: re-organize these routes
router.get("/all", mainController.getAll);
router.get("/:group", mainController.getSearch);

export default router;
