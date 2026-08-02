const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { authMiddleware } = require("../middlewares/auth");

router.get("/users/me", authMiddleware, getCurrentUser);
router.patch("/users/me", authMiddleware, updateProfile);

module.exports = router;
