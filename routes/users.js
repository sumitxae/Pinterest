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
    email: String,
    dp: {
      type: String,
      default: 'defaultdp.jpg',
    },
    nickname: {
      type: String,
      default: "New User"
    },
    user: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }],
    about: {
      type: String,
      default: "Write Something about You"
    },
  })

  userSchema.plugin(plm);

  module.exports = mongoose.model("user", userSchema);