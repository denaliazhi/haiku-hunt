import { validationResult, matchedData } from "express-validator";
import { validateClue } from "./validateClue.js";
import { addClue, getFountainClues } from "../data/queries/dbClues.js";
import { getFountain } from "../data/queries/dbFountains.js";

const controller = {
  /* Render fountain details page */
  getDetails: async (req, res) => {
    const id = req.params.id;
    try {
      const fountain = await getFountain(id);
      const clues = await getFountainClues(id);
      res.render("fountain", {
        title: "The Deets",
        entry: fountain[0],
        clues: clues,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send("Fountain not found.");
    }
  },

  /* Render form to add a haiku clue */
  getAddClue: (req, res) => {
    const backLink = `${req.baseUrl}/${req.params.id}`;
    res.render("clue-form", {
      id: req.params.id,
      errors: null,
      formEntry: null,
      backLink: backLink,
    });
  },

  /* Handle submission of new haiku clue */
  postAddClue: [
    validateClue,
    async (req, res) => {
      const id = req.params.id;
      const backLink = `${req.baseUrl}/${req.params.id}`;
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        // If valid, update clues table with new clue for fountain id
        await addClue([req.params.id, ...Object.values(matchedData(req))]);
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
