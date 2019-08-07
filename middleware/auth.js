const User = require("../models/user");

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
  }
};