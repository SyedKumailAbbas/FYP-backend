const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true, // Ensures the comment body is mandatory
  },
  postid: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Post document
    ref: 'Post',
    required: true, // Ensures the post ID is mandatory
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User document
    ref: 'User',
    required: true, // Ensures the user ID is mandatory
  },
});

module.exports = mongoose.model('Comment', commentSchema);
