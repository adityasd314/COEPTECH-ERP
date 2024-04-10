const express = require("express");
const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
const app = express();
// const connectDB = require("./config/connectDB");
const cors = require("cors");
app.use(cors());
app.use(helmet());
app.use(express.json());

const userRouter = require("./routes/user");
const venueRouter = require("./routes/venue");

// connectDB();

app.use("/user", userRouter);
app.use("/venue", venueRouter);

app.listen(5000, () => {
    console.log("http://localhost:5000/");
});
