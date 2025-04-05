// middleware/authMiddleware.js

module.exports = {
    isLoggedIn: (req, res, next) => {
      if (req.session && req.session.user) {
        next();
      } else {
        res.redirect("/login");
      }
    }
  };
  