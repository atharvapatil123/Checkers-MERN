const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// User module
const User = require("../models/User");

router.get("/login", (req, res) =>
  res.render("login", {
    log: false,
  })
);

router.get("/register", (req, res) =>
  res.render("register", {
    log: false,
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
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters long" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation Passed!
    User.findOne({ email: email }).then((user) => {                                                                                                                                                                                                                                         `                       `
      if (user) {
        //User exits
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
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

//logout Handle
router.get("/logout", (req, res) => {
  req.logout(); //Using passport middleware
  req.flash("success_msg", "You are successfully logged out");
  res.redirect("/users/login");
});


module.exports = router;
