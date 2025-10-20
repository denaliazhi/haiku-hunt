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
import fountainRouter from "./routers/fountainRouter.js";

/**
 * ---- General set-up ----
 */
const PORT = process.env.PORT;
const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));
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
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

/**
 * ---- Passport authentication ----
 */
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  next();
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

/**
 * ---- Routes ----
 */

app.use("/", mainRouter);
app.use("/:group", fountainRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

/**
 * ---- Server ----
 */

app.listen(PORT, async (err) => {
  if (err) {
    throw err;
  }
  await ejsConfig(app);
  console.log(`Server running on port ${PORT}`);
});
