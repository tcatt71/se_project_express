const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.get("/items", getItems);
router.post("/items", createItem);
router.delete("/items/:itemId", deleteItem);
router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", dislikeItem);
router.use((req, res) =>
  res.status(NOT_FOUND).json({
    message: "Requested resource not found",
  })
);

module.exports = router;
