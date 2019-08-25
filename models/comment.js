const mongoose = require("mongoose"),
      User = require("./user");

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Boolean,
    default: false
  },
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  wish: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wish"
    },
    name: String
  }
});

CommentSchema.pre("remove", function(next) {
  const Wish = require("./wish");
  Wish.findByIdAndUpdate(this.wish.id, {$pull: {comments: this._id}}, (err) => {
    if(err) {
      console.log(err);
    } else {
      User.findByIdAndUpdate(this.owner.id, {$pull: {comments: this._id}}, (err) => {
        if(err) {
          console.log(err);
        }
        next();
      });
    }
  });
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;