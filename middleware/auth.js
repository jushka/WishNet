const User = require("../models/user"),
      Wish = require("../models/wish"),
      Comment = require("../models/comment");

module.exports = {
  isLoggedIn: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in first to do that");
    res.redirect("/login");
  },
  
  forwardLoggedIn: function(req, res, next) {
    if(!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },
  
  matchUser: function(req, res, next) {
    if(req.isAuthenticated()) {
      User.findOne({username: req.params.username}, (err, user) => {
        if(err || !user) {
          req.flash("error_msg", "User not found");
          res.redirect("back");
        } else if(user._id.equals(req.user._id)) {
          return next();
        } else {
          req.flash("error_msg", "You do not have permission to do that");
          res.redirect("back");
        }
      });     
    } else {
      req.flash("error_msg", "Please log in first to do that");
      res.redirect("/login");
    }
  },
  
  checkWishOwnership: function(req, res, next) {
    if(req.isAuthenticated()) {
      Wish.findById(req.params.wish_id, (err, wish) => {
        if(err || !wish || wish.owner.username != req.params.username) {
          req.flash("error_msg", "Wish not found");
          res.redirect("back");
        } else if(wish.owner.id.equals(req.user._id)) {
          return next();
        } else {
          req.flash("error_msg", "You do not have permission to do that");
          res.redirect("back");
        }
      });
    } else {
      req.flash("error_msg", "Please log in first to do that");
      res.redirect("/login");
    }
  },
  
  checkCommentOwnership: function(req, res, next) {
    if(req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, comment) => {
        if(err || !comment) {
          req.flash("error_msg", "Comment not found");
          res.redirect("back");
        } else if(comment.owner.id.equals(req.user._id)) {
          return next();
        } else {
          req.flash("error_msg", "You do not have permission to do that");
          res.redirect("back");
        }
      });
    } else {
      req.flash("error_msg", "Please log in first to do that");
      res.redirect("/login");
    }
  }
};