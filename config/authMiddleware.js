function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("You must register an account to access this route.");
  }
}

function isAdmin() {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(401).send("Only admins may access this route.");
  }
}

export { isAuth, isAdmin };
