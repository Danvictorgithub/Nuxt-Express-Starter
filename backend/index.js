// Initiate the server and set up the middleware
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

const router = require("./router");
const passport = require("passport");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// PassportJS Setup
app.use(passport.initialize());
require("./configs/passport"); // loads the rest of the code

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Express v1.0.0" });
});
app.use("/api", router);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
