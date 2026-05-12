const ClothingItem = require("../models/clothingItem");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

function getItems(req, res) {
  ClothingItem.find({})
    .then((clothingItems) => res.send({ data: clothingItems }))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).json({ message: err.message });
    });
}

function createItem(req, res) {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ message: err.message });
    });
}

function deleteItem(req, res) {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ message: err.message });
    });
}

function likeItem(req, res) {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((like) => res.json({ data: like }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ message: err.message });
    });
}

function dislikeItem(req, res) {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((like) => res.json({ data: like }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ message: err.message });
    });
}

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
