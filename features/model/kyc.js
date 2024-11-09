const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
    address:{ type: String, required: true, unique: true }
  });


  module.exports = mongoose.model("KYCAPPROVED", kycSchema);