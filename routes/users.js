const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

router.get("/users", getUsers);
router.get("/users/:userId", getUser);
router.post("/users", createUser);
router.use((req, res) =>
  res.status(NOT_FOUND).json({
    message: "Requested resource not found",
  })
);

module.exports = router;
