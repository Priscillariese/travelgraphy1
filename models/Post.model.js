const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  location: { type: String },
  title: { type: String },
  comment: { type: String },
  image: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' } 
});

const Post = model('Post', postSchema);

module.exports = Post;

