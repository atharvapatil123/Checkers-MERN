const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  address: String,
  more: String,
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
