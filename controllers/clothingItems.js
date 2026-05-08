const ClothingItem = require("../models/clothingItem");

function getItems(req, res) {
  ClothingItem.find({}).then((clothingItems) =>
    res.send({ data: clothingItems })
  );
}

function createItem(req, res) {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl }).then((clothingItem) =>
    res.send({ data: clothingItem })
  );
}

function deleteItem(req, res) {
  const { id } = req.params;
  ClothingItem.findByIdAndDelete(id).then((clothingItem) =>
    res.send({ data: clothingItem })
  );
}

module.exports = { getItems, createItem, deleteItem };
