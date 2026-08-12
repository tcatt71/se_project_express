const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  toggleLike,
} = require("../controllers/clothingItems");
const { authMiddleware } = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

router.get("/items", getItems);

router.post("/items", authMiddleware, validateCardBody, createItem);
router.delete("/items/:itemId", authMiddleware, validateId, deleteItem);
router.put("/items/:itemId/likes", authMiddleware, validateId, toggleLike);
router.delete("/items/:itemId/likes", authMiddleware, validateId, toggleLike);

module.exports = router;
