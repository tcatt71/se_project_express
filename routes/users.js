const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { authMiddleware } = require("../middlewares/auth");
const { validateUpdateProfileBody } = require("../middlewares/validation");

router.get("/users/me", authMiddleware, getCurrentUser);
router.patch(
  "/users/me",
  authMiddleware,
  validateUpdateProfileBody,
  updateProfile
);

module.exports = router;
