import url from "url";
import path from "path";

import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pool from "./data/dbConnection.js";

import passport from "passport";
import "./config/passport.js";

import ejsConfig from "./config/ejs.js";

import mainRouter from "./routers/mainRouter.js";
import landmarkRouter from "./routers/landmarkRouter.js";
import userRouter from "./routers/userRouter.js";

import { capitalizeAll, obfuscate } from "./public/utils/stringUtils.js";

/* ---- General set-up ---- */

const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/icons")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// Set global functions to be accessible in ejs templates
app.locals.capitalizeAll = capitalizeAll;
app.locals.obfuscate = obfuscate;

/* ---- Session set-up ---- */

const sessionStore = new (connectPgSimple(session))({
  pool: pool,
});
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

/* ---- Passport authentication ---- */

app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

/* ---- Routes ---- */

app.use("/", mainRouter);
app.use("/user", userRouter);
app.use("/:location-filter", landmarkRouter);

app.use((err, req, res, next) => {
  console.error(err);
  // res
  //   .status(err.statusCode || 500)
  //   .render("error", { errorCode: err.statusCode, errorMessage: err.message });
  res.status(err.statusCode || 500).send(err.message);
});

/* ---- Server ---- */

const PORT = process.env.PORT;
app.listen(PORT, async (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running on port ${PORT}`);
  try {
    await ejsConfig(app);
  } catch (err) {
    console.log("Sidebar config not loaded: ", err);
    throw new Error("There was an issue loading this application.");
  }
});
