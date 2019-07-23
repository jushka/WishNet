const express = require("express"),
	  session = require("express-session"),
	  passport = require("passport"),
	  mongoose = require("mongoose"),
	  bodyParser = require("body-parser"),
	  User = require("./models/user"),
	  mongoURL = process.env.DATABASEURL || "mongodb://localhost:27017/wish_net";

const app = express();

// requiring routes
const indexRoutes = require("./routes/index.js");

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
app.use(bodyParser.urlencoded({extended: true}));

// session and passport configuration
app.use(session({
	secret: "What is your biggest desire?",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/", indexRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log("WishNet server has started!");
});