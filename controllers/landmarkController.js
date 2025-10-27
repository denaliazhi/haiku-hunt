import { validationResult, matchedData } from "express-validator";
import { validateClue } from "./validations/validateClue.js";
import { validateGuess } from "./validations/validateGuess.js";
import { addClue } from "../data/queries/dbClues.js";
import {
  filterByBorough,
  filterByBoroughUser,
  filterByName,
  filterByNameUser,
  getLandmarkDetails,
  getLandmarkDetailsUser,
} from "../data/queries/dbLandmarks.js";
import {
  solveLandmark,
  saveClue,
  unsaveClue,
  checkSolved,
} from "../data/queries/dbUsers.js";

const controller = {
  /* Render landmarks based on filter criteria*/
  getSearch: async (req, res) => {
    let matches, title;
    // Determine SQL query based on url parameter
    const param = decodeURI(req.baseUrl).slice(1);
    if (param.match(/search/i)) {
      const searchTerm = req.query.name;
      matches = req.isAuthenticated()
        ? await filterByNameUser(req.user.userid, searchTerm)
        : await filterByName(searchTerm);
      title = `Landmarks with '${searchTerm}' in name`;
    } else {
      matches = req.isAuthenticated()
        ? await filterByBoroughUser(req.user.userid, param)
        : await filterByBorough(param);
      title = `Landmarks in ${param}`;
    }

    res.render("index", {
      title: title,
      entries: matches,
    });
  },

  /* Render landmark details page */
  getDetails: async (req, res) => {
    const landmarkId = req.params.id;
    try {
      const result = req.isAuthenticated()
        ? await getLandmarkDetailsUser(req.user.userid, landmarkId)
        : await getLandmarkDetails(landmarkId);

      res.render("landmark-details", {
        title: "The Deets",
        entry: result[0],
        clues: result,
        guessing: Boolean(req.query.guessing) ? true : false,
        error: req.query.error,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send("There was an error loading this page.");
    }
  },

  /* Render form to add a haiku clue */
  getAddClue: async (req, res) => {
    const backLink = `${req.baseUrl}/${req.params.id}`;
    if (req.isAuthenticated()) {
      const isSolved = await checkSolved(req.user.userid, req.params.id);
      if (isSolved.length === 1) {
        // User has solved landmark and can add a clue
        res.render("clue-form", {
          errors: null,
          formEntry: null,
          backLink: backLink,
        });
      } else {
        // User hasn't solved the landmark yet
        res.redirect(
          `${backLink}?guessing=true&error=${encodeURI(
            "To submit a clue, solve the landmark first."
          )}`
        );
      }
    } else {
      // Only registered users can add clues
      res.redirect("/sign-up");
    }
  },

  /* Handle submission of new haiku clue */
  postAddClue: [
    validateClue,
    async (req, res) => {
      const landmarkId = req.params.id;
      const backLink = `${req.baseUrl}/${landmarkId}`;
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        // If valid, update clues table with new clue for landmark id
        await addClue([
          req.user.userid,
          landmarkId,
          ...Object.values(matchedData(req)),
        ]);
        res.redirect(backLink);
      } else {
        // If invalid, re-render form with errors and previously entered data
        res.status(400).render("clue-form", {
          errors: errors.array(),
          formEntry: req.body,
          backLink: backLink,
        });
      }
    },
  ],

  /* Add haiku clue to user's saved list */
  postSaveClue: async (req, res) => {
    const backLink = `${req.baseUrl}/${req.params.id}`;
    if (req.isAuthenticated()) {
      try {
        await saveClue(req.user.userid, req.params.clueid);
        res.redirect(backLink);
      } catch (err) {
        console.log(err);
        res.status(400).redirect(backLink);
      }
    } else {
      // Only registered users can save clues
      res.redirect("/sign-up");
    }
  },

  /* Remove haiku clue from user's saved list */
  postUnsaveClue: async (req, res) => {
    const backLink = `${req.baseUrl}/${req.params.id}`;
    try {
      await unsaveClue(req.user.userid, req.params.clueid);
      res.redirect(backLink);
    } catch (err) {
      console.log(err);
      res.status(400).redirect(backLink);
    }
  },

  /* Render field for user to submit guess for landmark */
  getSolveLandmark: async (req, res) => {
    const backLink = `${req.baseUrl}/${req.params.id}`;
    res.redirect(`${backLink}?guessing=true`);
  },

  /* Check if user's guess for landmark is correct */
  postSolveLandmark: [
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.redirect("/sign-up");
      }
    },
    validateGuess,
    async (req, res) => {
      const landmarkId = req.params.id;
      const backLink = `${req.baseUrl}/${landmarkId}`;
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        // Guess is correct. Render page with solve status
        await solveLandmark(req.user.userid, landmarkId);
        res.redirect(backLink);
      } else {
        // Guess is incorrect. Re-render page with error message
        res.redirect(
          `${backLink}?guessing=true&error=${encodeURI(
            "Sorry, that's not it."
          )}`
        );
      }
    },
  ],
};

export default controller;
