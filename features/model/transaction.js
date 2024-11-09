const mongoose = require("mongoose");

const transactionStatsSchema = new mongoose.Schema({
    address:{ type: String, required: true, unique: true },
    timeDiffFirstLastMins: { type: Number, required: true },
    avgValReceived: { type: Number, required: true },
    avgMinBetweenReceivedTnx: { type: Number, required: true },
    totalEtherSent: { type: Number, required: true },
    totalEtherReceived: { type: Number, required: true },
    receivedTnx: { type: Number, required: true },
    sentTnx: { type: Number, required: true },
    avgMinBetweenSentTnx: { type: Number, required: true },
    totalEtherBalance: { type: Number, required: true },
    avgValSent: { type: Number, required: true }
  });


  module.exports = mongoose.model("Transaction", transactionStatsSchema);