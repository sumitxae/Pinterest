var mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  dp: {
    type: String,
    default: "https://i.pinimg.com/564x/6e/33/16/6e331646689a8f9c1bb28883f5e12f86.jpg",
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


module.exports = mongoose.model("profile", profileSchema);