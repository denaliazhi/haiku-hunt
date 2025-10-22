import { validationResult, matchedData } from "express-validator";
import { validateClue } from "./validations/validateClue.js";
import { addClue, getLandmarkClues } from "../data/queries/dbClues.js";
import {
  filterByBorough,
  filterByName,
  getLandmark,
} from "../data/queries/dbLandmarks.js";

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
    const id = req.params.id;
    try {
      const landmark = await getLandmark(id);
      const clues = await getLandmarkClues(id);
      res.render("landmark", {
        title: "The Deets",
        entry: landmark[0],
        clues: clues,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send("Landmark not found.");
    }
  },

  /* Render form to add a haiku clue */
  getAddClue: (req, res) => {
    if (req.isAuthenticated()) {
      const backLink = `${req.baseUrl}/${req.params.id}`;
      res.render("clue-form", {
        id: req.params.id,
        errors: null,
        formEntry: null,
        backLink: backLink,
      });
    } else {
      res.redirect("/sign-up");
    }
  },

  /* Handle submission of new haiku clue */
  postAddClue: [
    validateClue,
    async (req, res) => {
      const id = req.params.id;
      const backLink = `${req.baseUrl}/${req.params.id}`;
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        // If valid, update clues table with new clue for landmark id
        await addClue([
          req.user.userId,
          req.params.id,
          ...Object.values(matchedData(req)),
        ]);
        res.redirect(backLink);
      } else {
        // If invalid, re-render form with errors and previously entered data
        res.status(400).render("clue-form", {
          id: id,
          errors: errors.array(),
          formEntry: req.body,
          backLink: backLink,
        });
      }
    },
  ],
};

export default controller;
