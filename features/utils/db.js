const mongoose = require('mongoose');
require("dotenv").config();

exports.connect = () => {
    mongoose.connect("mongodb+srv://yash:hN8LTdsV6TR7TxGG@cluster0.8o6trnc.mongodb.net/blacklistDB")
    .then(console.log("DB Connection Successful"))
    .catch(  (error) => {
        console.log("DB Connection Issues");
        console.error(error);
        process.exit(1);
    } );
};