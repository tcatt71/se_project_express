const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");
const { authMiddleware } = require("../middlewares/auth");

router.use(authMiddleware);
router.get("/users/me", getCurrentUser);

module.exports = router;
