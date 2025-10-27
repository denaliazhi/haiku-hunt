/*
 * Handle landmark-related requests
 */
import { Router } from "express";
import landmarkController from "../controllers/landmarkController.js";
import { isAuth } from "../config/passport.js";

const router = Router();
router.get("/", landmarkController.getSearch);
router.get("/:id", landmarkController.getDetails);
router.get("/:id/add", landmarkController.getAddClue);
router.post("/:id/add", isAuth, landmarkController.postAddClue);

router.post("/:id/save/:clueid", landmarkController.postSaveClue);
router.post("/:id/unsave/:clueid", isAuth, landmarkController.postUnsaveClue);

router.get("/:id/solve", landmarkController.getSolveLandmark);
router.post("/:id/solve", landmarkController.postSolveLandmark);

export default router;
