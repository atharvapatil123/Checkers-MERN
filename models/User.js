const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    default: 0,
    default: 81,
  },
  no_of_games: {
    type: Number,
    default: 0,
    default: 32,
  },
  wins: {
    type: Number,
    default: 0,
    default: 23,
  },
  best_win_time: {
    type: Number,
    default: 1,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
