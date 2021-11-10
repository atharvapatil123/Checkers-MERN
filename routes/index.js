const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
// const express = require('express');
const bodyParser = require("body-parser");
const app = express();
//const port = 3000;

//app.use(express.static("./"));
/* Parse JSON data using body parser. */

app.use(bodyParser.json());
// User module
const User = require("../models/User");
const Contact = require("../models/contact");

//Welcome Page
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    data: req.user,
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
router.get("/dashboard", ensureAuthenticated, async (req, res, next) => {
  User.find((err, docs) => {
    if (!err) {
      res.render("dashboard", {
        data: docs,
        log: req.isLogged,
        dash: true,
        email: req.user.email,
        name: req.user.name,
      });
    } else {
      console.log("Failed to retrieve the Course List: ");
    }
  });
});
router.post("/dashboard", async (req, res, next) => {
  const d = new Date();
  let day = d.getDay() - 1;
  let month = d.getMonth();

  const { human_win, email, m_m } = req.body;
  const filter = { email: email };
  let doc = await User.findOne(filter);

  let mm = parseInt(m_m);

  let score = doc["score"];
  let wins = doc["wins"];
  let no_of_games = doc["no_of_games"];
  let score_per_day = doc["score_per_day"];
  let score_per_month = doc["score_per_month"];
  let min_moves = doc["min_moves"];

  if (day == 0) {
    score_per_day = new Array(7).fill(0);
  }
  if (month == 0) {
    score_per_day = new Array(12).fill(0);
  }
  if (human_win == "true") {
    if (min_moves > mm) min_moves = mm;
    no_of_games = no_of_games + 1;
    score = score + 10;
    wins = wins + 1;
    score_per_day[day] = score_per_day[day] + 1;
    score_per_month[month] = score_per_month[month] + 1;
  } else if (human_win == "false") {
    no_of_games = no_of_games + 1;
    score = score - 5;
    score_per_day[day] = score_per_day[day] + 1;
    score_per_month[month] = score_per_month[month] + 1;
  }
  if (score < 0) score = 0;
  // Document changed in MongoDB, but not in Mongoose
  await User.updateOne(filter, {
    no_of_games: no_of_games,
    wins: wins,
    score: score,
    score_per_day: score_per_day,
    score_per_month: score_per_month,
    min_moves: min_moves,
  });

  // This will update `doc` age to `59`, even though the doc changed.
  //doc.age = 59;
  await doc.save();
  console.log(human_win, email, score, mm, "Type", typeof mm, min_moves);
  res.redirect("leaderboard");
});

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
