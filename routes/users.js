const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");

// User module
const User = require("../models/User");

router.get("/login", (req, res) =>
  res.render("login", {
    log: false,
    dash: req.isDashed,
  })
);

router.get("/register", (req, res) =>
  res.render("register", {
    log: false,
    dash: req.isDashed,
  })
);

router.get("/forgetpass", (req, res) =>
  res.render("forgetpass", {
    log: false,
    dash: req.isDashed,
  })
);

//Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please Fill in all fields" });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do no match" });
  }

  // Check pass length
  // if (password.length < 6) {
  //   errors.push({ msg: "Password should be atleast 6 characters long" });
  // }
  // if (
  //   password !=
  //   "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$"
  // ) {
  //   errors.push({
  //     msg: "Password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
  //   });
  // }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
      log: false,
      dash: req.isDashed,
    });
  } else {
    // Validation Passed!
    User.findOne({ email: email }).then((user) => {
      `                       `;
      if (user) {
        //User exits
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
          log: false,
          dash: req.isDashed,
        });
      } else {
        //   res.render("welcome")
        const newUser = new User({
          name,
          email,
          password,
        });

        //Hash Password
        bcrypt.genSalt(10, (error, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            //Set password to hashed password
            newUser.password = hash;

            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

//Login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//Forget password handle
router.post("/forgetpass", (req, res, next) => {
  const { email, password, password2 } = req.body;

  let errors = [];

  // Check required fields
  if (!email || !password || !password2) {
    errors.push({ msg: "Please Fill in all fields" });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do no match" });
  }

  if (errors.length > 0) {
    res.render("forgetpass", {
      errors,
      email,
      password,
      password2,
      log: false,
      dash: req.isDashed,
    });
  } else {
    // Validation Passed!
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log(user);
        //User exits
        //Hash Password
        bcrypt.genSalt(10, (error, salt) =>
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            //Set password to hashed password
            user.password = hash;

            user
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "Password is changed successfully. You can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      } else {
        errors.push({ msg: "No user found" });
        res.render("forgetpass", {
          errors,
          email,
          password,
          password2,
          log: false,
          dash: req.isDashed,
        });
      }
    });
  }
});

//logout Handle
router.get("/logout", (req, res) => {
  req.logout(); //Using passport middleware
  req.flash("success_msg", "You are successfully logged out");
  res.render("login", {
    log: false,
    dash: req.isDashed,
  });
});

module.exports = router;
