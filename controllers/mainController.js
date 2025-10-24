import passport from "passport";
import bcrypt from "bcryptjs";
import { validationResult, matchedData } from "express-validator";
import { validateSignUp } from "./validations/validateSignUp.js";
import {
  getAllEntries,
  getAllEntriesUser,
} from "../data/queries/dbLandmarks.js";
import { addUser } from "../data/queries/dbUsers.js";

const controller = {
  /* Render home page with all landmarks */
  getAll: async (req, res) => {
    const url = req.url;

    const allLandmarks = req.isAuthenticated()
      ? await getAllEntriesUser(req.user.userid)
      : await getAllEntries();
    res.render("index", {
      title: "All Landmarks",
      entries: allLandmarks,
      cardUrl: url,
    });
  },

  /* Render sign-up page */
  getSignUp: (req, res) => {
    res.render("sign-up", {
      errors: null,
      formEntry: null,
    });
  },

  /* Validate sign-up fields and add new user to database */
  postSignUp: [
    validateSignUp,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        // If valid, update users table with new username and password
        const matched = matchedData(req);
        try {
          const hashedPassword = await bcrypt.hash(matched.password, 10);
          await addUser(matched.username, hashedPassword);
          res.redirect("/sign-in");
        } catch (error) {
          console.error(error);
          next(error);
        }
      } else {
        // If invalid, re-render form with errors and previously entered data
        res.render("sign-up", {
          errors: errors.array(),
          formEntry: req.body,
        });
      }
    },
  ],

  /* Render sign-in page */
  getSignIn: (req, res) => {
    const errors = req.session.messages || [];
    req.session.messages = [];
    res.render("sign-in", {
      error: errors.length > 0 ? "Incorrect username or password" : null,
    });
  },

  /* Authenticate user sign-in */
  postSignIn: passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/sign-in",
    failureMessage: true,
  }),

  /* Sign out the user */
  getSignOut: (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  },

  /* Render about page */
  getAbout: (req, res) => {
    res.render("about");
  },
};

export default controller;
