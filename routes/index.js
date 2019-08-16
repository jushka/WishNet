const express = require("express"),
      passport = require("passport"),
      bcrypt = require("bcryptjs"),
      User = require("../models/user"),
      router = express.Router(),
      forwardLoggedIn = require("../middleware/auth").forwardLoggedIn,
      isLoggedIn = require("../middleware/auth").isLoggedIn;

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
  
  if(username.length < 6 || username.length > 30) {
    errors.push({message: "Username must be between 6 and 30 characters long"});
  }
  
  if(!/^[a-z0-9]+[a-z0-9._][a-z0-9]+$/.test(username)) {
    errors.push({message: "Incorrect username format. Username examples: username, username123, user_name, user.name"});
  }
     
  if(password != password2) {
    errors.push({message: "Passwords do not match"});
  }
  
  if(password.length < 6 || password.length > 30) {
    errors.push({message: "Password must be between 6 and 30 characters long"});
  }
  
  if(errors.length > 0) {
    res.locals.title = "Sign Up";
    res.render("signup", {
      errors,
      username,
      email,
    });
  } else {
    User.find({$or:[{username: username}, {email: email}]}).then((users) => {
      if(users.length > 0) {
        if(users.find(user => user.username === username)) {
          errors.push({message: "User with such username already exists"});
        }
        if(users.find(user => user.email === email)) {
          errors.push({message: "User with such email already exists"});
        }
        res.locals.title = "Sign Up";
        res.render("signup", {
          errors,
          username,
          email,
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
              req.flash("success_msg", "Your account has been created. You can log in now!");
              res.redirect("/login");
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
router.post("/login",
  passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: "You are now logged in!"
  }),
  (req, res) => {
  res.redirect("/" + req.user.username);
  }
);

// handle log out
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.flash("success_msg", "You are now logged out!");
  res.redirect("/");
});

// show user profile
router.get("/:username", isLoggedIn, (req, res) => {
  User.findOne({username: req.params.username}, (err, user) => {
    if(err || !user) {
      req.flash("error_msg", "User not found! Believe me :)");
      res.redirect("/");
    } else {
      res.locals.title = user.username + " Profile";
      res.render("profile", {user: user});
    }
  });
});

module.exports = router;