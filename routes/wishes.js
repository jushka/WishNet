const express = require("express"),
      User = require("../models/user"),
      Wish = require("../models/wish"),
      router = express.Router({mergeParams: true}),
      //forwardLoggedIn = require("../middleware/auth").forwardLoggedIn,
      isLoggedIn = require("../middleware/auth").isLoggedIn,
      matchUser = require("../middleware/auth").matchUser;

// INDEX - show all wishes
router.get("/", isLoggedIn, (req, res) => {
  User.findOne({username: req.params.username}).populate("wishes").exec((err, user) => {
    if(err || !user) {
      req.flash("error_msg", "User not found");
      res.redirect("back");
    } else {
      res.render("wishes/index", {user: user});
    }
  });
});

// NEW - show form to create a new wish
router.get("/new", matchUser, (req, res) => {
  User.findOne({username: req.params.username}, (err, user) => {
    if(err || !user) {
      req.flash("error_msg", "User not found");
      res.redirect("back");
    } else {
      res.render("wishes/new", {user: user});
    }
  });
});

// CREATE - create a new wish and add it to DB
router.post("/", matchUser, (req, res) => {
  User.findOne({username: req.params.username}, (err, user) => {
    if(err || !user) {
      req.flash("error_msg", "User not found");
      res.redirect("back");
    } else {
      Wish.create(req.body.wish, (err, wish) => {
        if(err) {
          req.flash("error_msg", "Something went wrong");
          res.redirect("back");
        } else {
          wish.owner.id = req.user._id;
          wish.owner.username = req.user.username;
          wish.save();
          user.wishes.push(wish);
          user.save();
          req.flash("success_msg", "Wish added successfully");
          res.redirect("/" + user.username + "/wishes");
        }
      })
    }
  });
});

module.exports = router;