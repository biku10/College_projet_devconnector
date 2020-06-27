const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
//avatar is from node module gravatar, It helps us to set default profile images

module.exports = mongoose.model('user', UserSchema);
//ithe apan chukun model chya jagi modelNames lihila jota. that was the
