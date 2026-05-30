const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { authMiddleware } = require("../middlewares/auth");

router.use(authMiddleware);
router.get("/users/me", getCurrentUser);
router.patch("/users/me", updateProfile);

module.exports = router;
