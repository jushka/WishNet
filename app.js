const express = require("express"),
	  session = require("express-session"),
	  passport = require("passport");

const app = express();

// requiring routes
const indexRoutes = require("./routes/index.js");

app.set("view engine", "ejs");

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