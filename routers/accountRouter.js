import { Router } from "express";
import accountController from "../controllers/accountController.js";
import { isAuth } from "../config/authMiddleware.js";

const router = Router();

router.use(isAuth);

router.get("/", (req, res) => {
  res.redirect("/account/published");
});
router.get("/published", accountController.getPublished);
router.get("/saved", accountController.getSaved);
router.get("/solved", accountController.getSolved);
router.post("/delete/:clueid", accountController.postDeleteClue);

export default router;
