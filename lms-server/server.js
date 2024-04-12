const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
require("dotenv").config();

const app = express();

const frontendUrl = process.env.FRONTEND_URL || "https://lmsfrontend.onrender.com";
const serverPort = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use(express.json());

const employeeRouter = require("./routes/employee");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const rulesRouter = require("./routes/rules");

connectDB();
app.use("/admin", adminRouter);
app.use("/employee", employeeRouter);
app.use("/user", userRouter);
app.use("/rule", rulesRouter);

// New route for home ("/") route
app.get("/", (req, res) => {
  res.send("Server is live!");
});

app.listen(serverPort, () => {
    console.log("Server is running on " + serverPort);
  });
