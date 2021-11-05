const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// User module
const User = require("../models/User");
const Contact = require("../models/contact");

//Welcome Page
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("dahsboard", {
    name: req.user.name,
    log: req.isLogged,
    dash: req.isDashed,
  });
});

//layout page
router.get("/layout", ensureAuthenticated, (req, res) =>
  res.render("layout", {
    name: req.user.name,
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
    name: req.user.name,
  })
);

//rules page
router.get("/rules", ensureAuthenticated, (req, res) =>
  res.render("rules", {
    log: req.isLogged,
    dash: req.isDashed,
    name: req.user.name,
  })
);

//contact page
router.get("/contact", ensureAuthenticated, (req, res) =>
  res.render("contact", {
    log: req.isLogged,
    dash: req.isDashed,
    name: req.user.name,
  })
);

router.post("/contact", ensureAuthenticated, (req, res, next) => {
  let myData = new Contact(req.body);
  myData
    .save()
    .then(() => {
      //returrns a promise after save
      // res.status(200).render('index.pug') ;
      // req.flash('success', 'Thanks for the message! I’ll be in touch :)');
      res.status(200).render("contact", {
        log: req.isLogged,
        dash: req.isDashed,
        name: req.user.name,
      });
    })
    .catch(() => {
      res.status(404).send("Item not saved in database :(");
    });
});

//logout page
router.get("/logout", ensureAuthenticated, (req, res) =>
  res.render("logout", {
    log: req.isLogged,
    dash: req.isDashed,
    name: req.user.name,
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
        name: req.user.name,
      });
    } else {
      console.log("Failed to retrieve the Course List: ");
    }
  });
});
router.get("/profile", ensureAuthenticated, (req, res, next) => {
  User.find({ name: req.user.name }, (err, docs) => {
    if (!err) {
      res.render("profile", {
        data: docs,
        log: req.isLogged,
        dash: req.isDashed,
        name: req.user.name,
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
