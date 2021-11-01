const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

//Passport config
require("./config/passport")(passport);

//DB config
const db = require("./config/keys").MongoURI;

//Connect to mongo
mongoose
  .connect(db, { useNewUrlparser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err)); //Cluster connected only

//EJS
app.use(expressLayout);
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/static"));

//BodyParser
app.use(express.urlencoded({ extended: false })); //Allows to get data from form using req.body

//Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash()); // Use to display message after redirect to different page

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));

app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`SERVER STARTED at ${PORT}`));
