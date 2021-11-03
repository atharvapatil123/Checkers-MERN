const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// User module
const User = require("../models/User");

//Welcome Page
router.get("/",  ensureAuthenticated,(req, res) => {
  res.render("dahsboard", {
    name: req.user.name,
    log: req.isLogged,
    dash: req.isDashed,
  });
});

//layout page
router.get("/layout", ensureAuthenticated, (req, res) =>
  res.render("layout", {
    log: req.isLogged,
    dash: req.isDashed,
  })
);

//Dashboard Page
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    name: req.user.name,
    log: req.isLogged,
    dash: true,
  })
);

//about page
router.get("/about", ensureAuthenticated, (req, res) =>
  res.render("about", {
    log: req.isLogged,
    dash: req.isDashed,
  })
);

//rules page
router.get("/rules", ensureAuthenticated, (req, res) =>
  res.render("rules", {
    log: req.isLogged,
    dash: req.isDashed,
  })
);

//logout page
router.get("/logout", ensureAuthenticated, (req, res) =>
  res.render("logout", {
    log: req.isLogged,
    dash: req.isDashed,
  })
);

//leaderboard page
router.get("/leaderboard", ensureAuthenticated, (req, res, next) => {
  User.find((err, docs) => {
    if (!err) {
      res.render("leaderboard", {
        data: docs,
        log: req.isLogged,
        dash: req.isDashed,
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
