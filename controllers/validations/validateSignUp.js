import { body } from "express-validator";
import { findUser } from "../../data/queries/dbUsers.js";

export const validateSignUp = [
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3-30 characters")
    // Check that username doesn't already exist
    .custom(async (value) => {
      const match = await findUser(value);
      if (match.length !== 0) {
        throw new Error("This username already exists");
      }
      return true;
    }),

  body("password")
    // Check that "password" matches "confirm password"
    .custom((value, { req }) => {
      if (value !== req.body["confirm-password"]) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters")
    .isStrongPassword()
    .withMessage(
      "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
    ),

  body("*")
    // Sanitize all fields
    .trim()
    .escape(),
];
