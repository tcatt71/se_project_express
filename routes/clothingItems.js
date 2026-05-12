const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.get("/items", getItems);
router.post("/items", createItem);
router.delete("/items/:itemId", deleteItem);
router.use((req, res) =>
  res.status(NOT_FOUND).json({
    message: "Requested resource not found",
  })
);

module.exports = router;
