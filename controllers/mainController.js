import passport from "passport";
import bcrypt from "bcryptjs";
import { validationResult, matchedData } from "express-validator";
import { validateSignUp } from "./validations/validateSignUp.js";
import {
  getAllEntries,
  filterByName,
  filterByBorough,
} from "../data/queries/dbLandmarks.js";
import { addUser, getPublished } from "../data/queries/dbUsers.js";

const controller = {
  /* Render main page with all fountains */
  getAll: async (req, res) => {
    const url = req.url;

    const allFountains = await getAllEntries();
    res.render("main", {
      title: "All Landmarks",
      entries: allFountains,
      cardUrl: url,
    });
  },

  /* Render main page with results after filtering fountains*/
  getSearch: async (req, res) => {
    let matches, title;
    const url = req.url;

    // Determine SQL query based on url parameter
    const param = req.params.group;
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
    successRedirect: "/account",
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

  /* Render user's dashboard */
  getDashboard: async (req, res, next) => {
    const clues = await getPublished(req.user.userid);
    res.render("user-dashboard", { clues: clues });
  },

  /* Render about page */
  getAbout: (req, res) => {
    res.render("about");
  },
};

export default controller;
