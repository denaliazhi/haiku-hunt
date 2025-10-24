/*
 * Handle user-related requests
 */
import { Router } from "express";
import userController from "../controllers/userController.js";
import { isAuth } from "../config/passport.js";

const router = Router();

router.use(isAuth);

router.get("/", (req, res) => {
  res.redirect("/user/published");
});
router.get("/published", userController.getPublished);
router.get("/saved", userController.getSaved);
router.get("/solved", userController.getSolved);
router.post("/delete/:clueid", userController.postDeleteClue);

export default router;
