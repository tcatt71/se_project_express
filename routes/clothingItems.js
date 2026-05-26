const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  toggleLike,
} = require("../controllers/clothingItems");
const { authMiddleware } = require("../middlewares/auth");

router.get("/items", getItems);
router.use(authMiddleware);
router.post("/items", createItem);
router.delete("/items/:itemId", deleteItem);
router.put("/items/:itemId/likes", toggleLike);
router.delete("/items/:itemId/likes", toggleLike);

module.exports = router;
