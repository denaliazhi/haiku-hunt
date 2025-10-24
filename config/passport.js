/**
 * Configure user authentication with passport local
 * strategy (simple username and password)
 */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import pool from "../data/dbConnection.js";

/* Callback to accept and verify user credentials */
const verifier = async (username, password, done) => {
  try {
    // Check if username exists
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    // Check if inputted password matches stored password for username
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return done(null, false, { message: "Incorrect password" });
    }
    // Both username and password match an existing record
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
const strategy = new LocalStrategy(verifier);
passport.use(strategy);

/* Upon successful authentication, store userId in session */
passport.serializeUser((user, done) => {
  done(null, user.userid);
});

/* Determine signed-in user based on userId stored in session */
passport.deserializeUser(async (userid, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE userid = $1", [
      userid,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

/* Middleware to prevent access to certain routes
   by users who aren't signed in */
function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("You must register an account to access this route.");
  }
}

/* Middleware to prevent access to certain routes
   by users who aren't admins */
function isAdmin() {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(401).send("Only admins may access this route.");
  }
}

export { isAuth, isAdmin };
