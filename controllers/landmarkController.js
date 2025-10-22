import { validationResult, matchedData } from "express-validator";
import { validateClue } from "./validations/validateClue.js";
import {
  addClue,
  getLandmarkClues,
  getLandmarkCluesWithSaves,
} from "../data/queries/dbClues.js";
import {
  filterByBorough,
  filterByName,
  getLandmark,
} from "../data/queries/dbLandmarks.js";
import { saveClue, unsaveClue } from "../data/queries/dbUsers.js";

const controller = {
  /* Render landmarks based on filter criteria*/
  getSearch: async (req, res) => {
    let matches, title;

    // Determine SQL query based on url parameter
    const param = decodeURI(req.baseUrl).slice(1);
    if (param.match(/search/i)) {
      const searchTerm = req.query.name;
      matches = await filterByName(searchTerm);
      title = `Landmarks with '${searchTerm}' in name`;
    } else {
      matches = await filterByBorough(param);
      title = `Landmarks in ${param}`;
    }

    res.render("main", {
      title: title,
      entries: matches,
    });
  },

  /* Render landmark details page */
  getDetails: async (req, res) => {
    const landmarkId = req.params.id;
    try {
      const landmark = await getLandmark(landmarkId); // TO DO: is this more efficient if joined with below query?
      const clues = req.isAuthenticated()
        ? await getLandmarkCluesWithSaves(req.user.userid, landmarkId)
        : await getLandmarkClues(landmarkId);
      res.render("landmark", {
        title: "The Deets",
        entry: landmark[0],
        clues: clues,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send("There was an error loading this page.");
    }
  },

  /* Render form to add a haiku clue */
  getAddClue: (req, res) => {
    if (req.isAuthenticated()) {
      const backLink = `${req.baseUrl}/${req.params.id}`;
      res.render("clue-form", {
        errors: null,
        formEntry: null,
        backLink: backLink,
      });
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
        console.log("Saving...");
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
};

export default controller;
