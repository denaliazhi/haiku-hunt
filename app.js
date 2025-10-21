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

/**
 * ---- General set-up ----
 */
const PORT = process.env.PORT;
const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

/**
 * ---- Session set-up ----
 */
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

/**
 * ---- Passport authentication ----
 */
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

/**
 * ---- Routes ----
 */

app.use("/", mainRouter);
app.use("/:group", landmarkRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
  // TO DO: create error page with redirect link
});

/**
 * ---- Server ----
 */

app.listen(PORT, async (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running on port ${PORT}`);
  await ejsConfig(app); // TO DO: move this
});
