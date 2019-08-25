const mongoose = require("mongoose"),
      User = require("./user"),
      Comment = require("./comment");

const WishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

WishSchema.pre("remove", function(next) {
  User.findByIdAndUpdate(this.owner.id, {$pull: {wishes: this._id}}, (err) => {
    if(err) {
      console.log(err);
    }
    else {
      Comment.find({"wish.id": this._id}, (err, comments) => {
        if(err) {
          console.log(err);
        } else {
          comments.forEach((comment) => {
            User.findOneAndUpdate({username: comment.owner.username}, {$pull: {comments: comment._id}}, (err) => {
              if(err) {
                console.log(err);
              } else {
                comment.delete();
              }
            });
          });
        }
      });
      next();
    }
  });
});

const Wish = mongoose.model("Wish", WishSchema);

module.exports = Wish;