const ClothingItem = require("../models/clothingItem");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/helpers");

function getItems(req, res) {
  ClothingItem.find({})
    .then((clothingItems) => sendSuccessResponse(res, clothingItems))
    .catch((err) => sendErrorResponse(res, err));
}

function createItem(req, res) {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => sendSuccessResponse(res, clothingItem, 201))
    .catch((err) => sendErrorResponse(res, err));
}

function deleteItem(req, res) {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((clothingItem) => {
      if (clothingItem.owner.toString() !== req.user._id) {
        const err = new Error();
        err.name = "ForbiddenError";

        throw err;
      }

      return clothingItem.deleteOne();
    })
    .then((clothingItem) => sendSuccessResponse(res, clothingItem))
    .catch((err) => sendErrorResponse(res, err));
}

function toggleLike(req, res) {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  const operation = req.method === "DELETE" ? "$pull" : "$addToSet";

  ClothingItem.findByIdAndUpdate(
    itemId,
    { [operation]: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((like) => sendSuccessResponse(res, like))
    .catch((err) => sendErrorResponse(res, err));
}

module.exports = { getItems, createItem, deleteItem, toggleLike };
