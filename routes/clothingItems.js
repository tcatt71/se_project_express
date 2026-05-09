const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/items", getItems);
router.post("/items", createItem);
router.delete("/items/:itemId", deleteItem);
router.use((req) =>
  req.statusCode(404).json({
    message: "Requested resource not found",
  })
);
