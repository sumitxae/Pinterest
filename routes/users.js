const mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

mongoose.connect("mongodb://0.0.0.0:27017/wakeupsid");


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts'
  }],
  dp: String,
  email: String
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);