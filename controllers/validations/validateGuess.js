import { body } from "express-validator";
import leven from "leven";

export const validateGuess = [
  body("guess")
    .trim()
    .customSanitizer((value) => value.replace(/\s+/g, " "))
    // Check for string similarity > 80%
    .custom((value, { req }) => {
      const answer = req.query.name;
      const distance = leven(value.toLowerCase(), answer.toLowerCase());
      const similarity = (answer.length - distance) / answer.length;
      if (similarity > 0.8) {
        return true;
      }
      throw new Error("Guess doesn't match landmark name.");
    }),
];
