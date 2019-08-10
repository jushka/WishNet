const mongoose = require("mongoose"),
      User = require("./user");

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
  }
});

WishSchema.pre("remove", function(next) {
  User.findByIdAndUpdate(this.owner.id, {$pull: {wishes: this._id}}, (err) => {
    if(err) {
      console.log(err);
    }
    next();
  });
});

const Wish = mongoose.model("Wish", WishSchema);

module.exports = Wish;