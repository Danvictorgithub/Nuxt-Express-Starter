const express = require("express");
const router = express.Router();

const {
  findAll,
  findOne,
  create,
  update,
  delete: _delete,
  signin,
} = require("./usersController");
const passport = require("passport");

router.get("/", findAll);
router.get(
  "/validate",
  passport.authenticate("jwt", { session: false }),
  (req, res) => res.json(req.user)
);
router.get("/:id", findOne);
router.post("/", create);
router.post("/signin", signin);
router.put("/:id", update);
router.delete("/:id", _delete);

module.exports = router;
