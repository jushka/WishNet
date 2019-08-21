const express = require("express"),
      User = require("../models/user"),
      Wish = require("../models/wish"),
      Comment = require("../models/comment"),
      router = express.Router({mergeParams: true}),
      isLoggedIn = require("../middleware/auth").isLoggedIn;

// CREATE - create a new comment
router.post("/", isLoggedIn, (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if(err || !user) {
      req.flash("error_msg", "User not found");
      res.redirect("back");
    } else {
      Wish.findById(req.params.wish_id, (err, wish) => {
        if(err || !wish || wish.owner.username !== req.params.username) {
          req.flash("error_msg", "Wish not found");
          res.redirect("back");
        } else {
          Comment.create(req.body.comment, (err, comment) => {
            if(err) {
              req.flash("error_msg", "Something went wrong");
              res.redirect("back");
            } else {
              comment.owner.id = req.user._id;
              comment.owner.username = req.user.username;
              comment.wish.id = wish._id;
              comment.wish.name = wish.name;
              comment.save();
              user.comments.push(comment);
              user.save();
              wish.comments.push(comment);
              wish.save();
              req.flash("success_msg", "Comment added successfully");
              res.redirect("/" + req.params.username + "/wishes/" + req.params.wish_id);
            }
          });
        }
      });
    }
  });
});

module.exports = router;