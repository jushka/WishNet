const express = require("express"),
      User = require("../models/user"),
      Wish = require("../models/wish"),
      router = express.Router({mergeParams: true}),
      isLoggedIn = require("../middleware/auth").isLoggedIn,
      matchUser = require("../middleware/auth").matchUser,
      checkWishOwnership = require("../middleware/auth").checkWishOwnership;

// INDEX - show all wishes
router.get("/", isLoggedIn, (req, res) => {
  User.findOne({username: req.params.username}).populate("wishes").exec((err, user) => {
    if(err || !user) {
      req.flash("error_msg", "User not found");
      res.redirect("back");
    } else {
      res.locals.title = user.username + " Wishes";
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
      res.locals.title = "Make a Wish";
      res.render("wishes/new", {user: user});
    }
  });
});

// CREATE - create a new wish
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

// SHOW - show info about particular wish
router.get("/:wish_id", isLoggedIn, (req, res) => {
  Wish.findById(req.params.wish_id, (err, wish) => {
    if(err || !wish || wish.owner.username != req.params.username) {
      req.flash("error_msg", "Wish not found");
      res.redirect("back");
    } else {
      res.locals.title = wish.owner.username + " Wish";
      res.render("wishes/show", {wish: wish});
    }
  });
});

// EDIT - show form to edit wish
router.get("/:wish_id/edit", checkWishOwnership, (req, res) => {
  Wish.findById(req.params.wish_id, (err, wish) => {
    if(err || !wish) {
      req.flash("error_msg", "Wish not found");
      res.redirect("back");
    } else {
      res.locals.title = "Edit Wish";
      res.render("wishes/edit", {wish: wish});
    }
  });
});

// UPDATE - update particular wish
router.put("/:wish_id", checkWishOwnership, (req, res) => {
  Wish.findByIdAndUpdate(req.params.wish_id, req.body.wish, (err, wish) => {
    if(err || !wish) {
      req.flash("error_msg", "Wish not found");
      res.redirect("back");
    } else {
      req.flash("success_msg", "Wish updated successfully!");
      res.redirect("/" + wish.owner.username + "/wishes/" + wish._id);
    }
  });
});

// DESTROY - delete particular wish
router.delete("/:wish_id", checkWishOwnership, (req, res, next) => {
  Wish.findById(req.params.wish_id, (err, wish) => {
    if(err) {
      return next(err);
    }
    wish.remove();
    req.flash("success_msg", "Wish deleted successfully!");
    res.redirect("/" + req.params.username + "/wishes");
  });
});

module.exports = router;