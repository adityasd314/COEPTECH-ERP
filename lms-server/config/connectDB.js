const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGO_URL;
const connectDB = async () => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("We got the MongoDB.");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = connectDB;
