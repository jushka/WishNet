const express = require("express"),
      session = require("express-session"),
      passport = require("passport"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      flash = require("connect-flash"),
      User = require("./models/user"),
      mongoURL = process.env.DATABASEURL || "mongodb://localhost:27017/wish_net";

const app = express();

// mongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useFindAndModify: false
}).then(() => {
  console.log("Connected to DB!");
}).catch((err) => {
  console.log("ERROR: " + err.message);
});

// app config
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

// session and passport configuration
app.use(session({
  secret: "What is your biggest desire?",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// global variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.title = "WishNet";
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// routes
app.use("/", require("./routes/index"));
app.use("/:username/wishes", require("./routes/wishes"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("WishNet server has started!");
});