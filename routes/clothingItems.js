const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  toggleLike,
} = require("../controllers/clothingItems");
const { authMiddleware } = require("../middlewares/auth");

router.get("/items", getItems);

router.post("/items", authMiddleware, createItem);
router.delete("/items/:itemId", authMiddleware, deleteItem);
router.put("/items/:itemId/likes", authMiddleware, toggleLike);
router.delete("/items/:itemId/likes", authMiddleware, toggleLike);

module.exports = router;
