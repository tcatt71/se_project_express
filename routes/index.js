const router = require("express").Router();
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

const NotFoundError = require("../errors/NotFoundError");
const {
  validateLoginBody,
  validateUserBody,
} = require("../middlewares/validation");

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);

router.use("/", clothingItemsRouter);
router.use("/", usersRouter);

router.use((req, res, next) =>
  next(new NotFoundError("Requested resource not found"))
);

module.exports = router;
