const express = require("express");
const router = express.Router();
const messagesRouter = require("../controller/messages/messagesRouter");
const usersRouter = require("../controller/users/usersRouter");
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Express API v1.0.0" });
});
router.get("/hello", (req, res) => {
  res.json({ message: "Hello, world!" });
});
router.use("/messages", messagesRouter);
router.use("/users", usersRouter);
module.exports = router;
