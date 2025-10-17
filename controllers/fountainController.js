import { body, validationResult, matchedData } from "express-validator";
import { syllable } from "syllable";
import {
  RegExpMatcher,
  englishDataset as dataset,
  englishRecommendedTransformers as recommended,
} from "obscenity";

import { getFountainClues } from "../data/queries/dbClues.js";
import { getFountain } from "../data/queries/dbFountains.js";

const validateClue = [
  body("*")
    // Sanitize all fields
    .trim()
    .escape()
    .customSanitizer((value) => value.replace(/\s+/g, " "))
    // Check all fields for inappropriate words
    .custom((value) => {
      const matcher = new RegExpMatcher({
        ...dataset.build(),
        ...recommended,
      });
      if (matcher.hasMatch(value)) {
        const wordsToEdit = [];

        const matches = matcher.getAllMatches(value, true);
        for (const match of matches) {
          const { phraseMetadata } =
            dataset.getPayloadWithPhraseMetadata(match);
          wordsToEdit.push(phraseMetadata.originalWord);
        }
        throw new Error(
          `Uh oh! Edit '${value}' for words like '${wordsToEdit.join(", ")}'.`
        );
      }
      return true;
    }),
  // TO DO: Check line contains valid English words

  body("author")
    .isLength({ min: 2, max: 20 })
    .withMessage(`Name must be between 2-20 characters`),

  body("line-1")
    .isLength({ min: 5, max: 50 })
    .withMessage("Line 1 must be between 5-50 characters")
    // Check that line has 5 syllables
    .custom((value) => {
      const count = syllable(value);
      if (count !== 5) {
        throw new Error("Line 1 must have exactly 5 syllables");
      }
      return true;
    }),

  body("line-2")
    .isLength({ min: 5, max: 50 })
    .withMessage("Line 2 must be between 5-50 characters")
    // Check that line has 7 syllables
    .custom((value) => {
      const count = syllable(value);
      if (count !== 7) {
        throw new Error("Line 2 must have exactly 7 syllables");
      }
      return true;
    }),

  body("line-3")
    .isLength({ min: 5, max: 50 })
    .withMessage("Line 3 must be between 5-50 characters")
    // Check that line has 5 syllables
    .custom((value) => {
      const count = syllable(value);
      if (count !== 5) {
        throw new Error("Line 3 must have exactly 5 syllables");
      }
      return true;
    }),
];

const controller = {
  getDetails: async (req, res) => {
    const id = req.params.id;
    try {
      const fountain = await getFountain(id);
      const clues = await getFountainClues(id);
      res.render("fountain", {
        title: "Blah",
        entry: fountain[0],
        options: req.app.locals.boroughs,
        clues: clues,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send("Fountain not found.");
    }
  },

  getAddClue: (req, res) => {
    res.render("clueForm", {
      title: "Add a Haiku Clue", // TO DO: change
      options: req.app.locals.boroughs,
      id: req.params.id,
      errors: null,
      formEntry: null,
    });
  },

  postAddClue: [
    validateClue,
    async (req, res) => {
      const id = req.params.id;
      const errors = validationResult(req);

      // If valid, update clues table with new clue for fountain id
      if (errors.isEmpty()) {
        console.log("Valid data: ", matchedData(req));
        // updateFountain(req.params.id, matchedData(req));

        return res.redirect(`/fountain/${id}`);
      }

      // If invalid, re-render form with errors and previously entered data
      res.status(400).render("clueForm", {
        title: "Add a Haiku Clue", // TO DO: change
        options: req.app.locals.boroughs,
        id: id,
        errors: errors.array(),
        formEntry: req.body,
      });
    },
  ],
};

export default controller;

// {
//   'line-1': 'I am a cat',
//   'line-2': "No I'm not",
//   'line-3': 'Yes',
//   author: 'Cat'
// }
