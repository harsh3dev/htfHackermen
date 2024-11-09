const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
    address:{ type: String, required: true, unique: true }
  });


  module.exports = mongoose.model("blacklists", blacklistSchema);