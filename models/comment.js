const mongoose = require("mongoose");

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

/////////////////////////////////////////////////////////// add pre hook

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;