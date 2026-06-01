const router = require("express").Router();
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/", usersRouter);
router.use("/", clothingItemsRouter);

router.use((req, res) =>
  res.status(NOT_FOUND).json({
    message: "Requested resource not found",
  })
);

module.exports = router;
