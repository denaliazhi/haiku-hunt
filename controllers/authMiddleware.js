function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

function isAdmin() {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(401).send("Unauthorized. Not Admin");
  }
}

export { isAuth, isAdmin };
