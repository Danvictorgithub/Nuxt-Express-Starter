const express = require("express");
const router = express.Router();
const {
  findAll,
  findOne,
  create,
  update,
  delete: _delete,
} = require("./messagesController");

router.get("/", findAll);
router.get("/:id", findOne);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", _delete);
module.exports = router;
