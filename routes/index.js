const express = require("express"),
	  router = express.Router();

// root
router.get("/", (req, res) => {
	res.render("index");
});

// show sign up form
router.get("/signup", (req, res) => {
	res.render("signup");
});

// handle sign up

// show log in form
router.get("/login", (req, res) => {
	res.render("login");
});

// handle log in

// handle log out
router.get("/logout", (req, res) => {
	res.redirect("/");
});

module.exports = router;