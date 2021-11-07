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
  threshold_move: {
    type: Number,
    default: 10,
  },
  score_per_month: {
    type: Array,
    default: [5, 1, 4, 1, 2, 3, 4, 1, 2, 1, 2, 4],
  },
  score_per_day: {
    type: Array,
    default: [1, 0, 1, 2, 0, 3, 2],
  },
  temp_array: {
    type: Array,
    default: [],
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;