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
    default: 50,
  },
  no_of_games: {
    type: Number,
    default: 0,
    // default: 32,
  },
  wins: {
    type: Number,
    default: 0,
    // default: 23,
  },
  score_per_month: {
    type: Array,
    default: new Array(12).fill(0),
  },
  score_per_day: {
    type: Array,
    default: new Array(7).fill(0),
  },
  temp_array: {
    type: Array,
    default: [],
  },
  min_moves: {
    type: Number,
    default:1000
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
