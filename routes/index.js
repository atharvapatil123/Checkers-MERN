const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// User module
const User = require("../models/User");

//Welcome Page
router.get("/", (req, res) => {
  res.render("login", {
    log: false,
  });
});

//layout page
router.get("/layout", ensureAuthenticated, (req, res) =>
  res.render("layout", {
    log: req.isLogged,
  })
);

//Dashboard Page
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    name: req.user.name,
    log: req.isLogged,
  })
);

//about page
router.get("/about", ensureAuthenticated, (req, res) =>
  res.render("about", {
    log: req.isLogged,
  })
);

//rules page
router.get("/rules", ensureAuthenticated, (req, res) =>
  res.render("rules", {
    log: req.isLogged,
  })
);

//logout page
router.get("/logout", ensureAuthenticated, (req, res) =>
  res.render("logout", {
    log: req.isLogged,
  })
);

//leaderboard page
router.get("/leaderboard", ensureAuthenticated, (req, res, next) => {
  User.find((err, docs) => {
    if (!err) {
      res.render("leaderboard", {
        data: docs,
        log: req.isLogged,
      });
    } else {
      console.log("Failed to retrieve the Course List: ");
    }
  });
});
// router.get("/leaderboard", ensureAuthenticated, (req, res) => {
//   res.render("leaderboard", {
//     log: req.isLogged,
//     score: req.user.score,
//   });
// });

module.exports = router;
