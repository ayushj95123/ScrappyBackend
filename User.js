const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, match: /^\S+@\S+\.\S+$/, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true, minlength: 8, maxlength: 30, match: /^[a-zA-Z0-9]+$/ },
  phoneNumber: { type: String, match: /^\d{10}$/ },
});

const User = mongoose.model('User', userSchema);

module.exports = User;