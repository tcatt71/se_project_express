const router = require("express").Router();
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

const { NotFoundError } = require("../middlewares/errorHandler");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/", clothingItemsRouter);
router.use("/", usersRouter);

router.use((req, res, next) =>
  next(new NotFoundError("Requested resource not found"))
);

module.exports = router;
