import { body } from "express-validator";
import { syllable } from "syllable";
import {
  RegExpMatcher,
  englishDataset as dataset,
  englishRecommendedTransformers as recommended,
} from "obscenity";

export const validateClue = [
  body("*")
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
    })
    // Fields must include only letters and common punctuation marks
    .custom((value) => {
      const pattern = /[^ \p{L}.,?!:;\-()'"]+/u;
      if (pattern.test(value)) {
        throw new Error(`Remove numbers or special symbols in '${value}'.`);
      }
      return true;
    }),

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
        throw new Error(`Line 1 must have 5 syllables, counted ${count}`);
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
        throw new Error(
          `Line 2 must have exactly 7 syllables, counted ${count}`
        );
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
        throw new Error(
          `Line 3 must have exactly 5 syllables, counted ${count}`
        );
      }
      return true;
    }),

  body("*")
    // Sanitize all fields
    .trim()
    .customSanitizer((value) => value.replace(/\s+/g, " ")),
];
