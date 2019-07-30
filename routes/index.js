const express = require("express"),
      passport = require("passport"),
      bcrypt = require("bcryptjs"),
      User = require("../models/user"),
      router = express.Router(),
      forwardLoggedIn = require("../middleware/auth").forwardLoggedIn;

// root
router.get("/", (req, res) => {
  res.locals.title = "WishNet";
  res.render("index");
});

// show sign up form
router.get("/signup", forwardLoggedIn, (req, res) => {
  res.locals.title = "Sign Up";
  res.render("signup");
});

// handle sign up
router.post("/signup", (req, res) => {
  const {username, email, password, password2} = req.body;
  let errors = [];
  
  if(!username || !email || !password || !password2) {
    errors.push({message: "Please enter all fields"});
  }
  
  if(password != password2) {
    errors.push({message: "Passwords do not match"});
  }
  
  if(password.length < 6) {
    errors.push({message: "Password must be at least 6 characters long"});
  }
  
  if(errors.length > 0) {
    res.render("signup", {
      errors,
      username,
      email,
      password,
      password2
    });
  } else {
    User.findOne({email: email}).then((user) => {
      if(user) {
        errors.push({message: "User with such email already exists"});
        res.render("signup", {
          errors,
          username,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          username,
          email,
          password
        });
        
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {
              throw err;
            }
            newUser.password = hash;
            newUser.save().then((user) => {
              req.flash("success", "Your account has been created. You can log in now");
              res.redirect("login");
            }).catch((err) => {
              console.log(err);
            });
          });
        });
      }
    });
  }
});

// show log in form
router.get("/login", forwardLoggedIn, (req, res) => {
  res.locals.title = "Log In";
  res.render("login");
});

// handle log in
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}), (req, res) => {
});

// handle log out
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You are logged out now");
  res.redirect("/");
});

module.exports = router;