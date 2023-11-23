var mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: String,
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  likes: {
    type: Array,
    default: []
  }
})


module.exports = mongoose.model("posts", postSchema);