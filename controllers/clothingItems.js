const ClothingItem = require("../models/clothingItem");
const { sendSuccessResponse } = require("../utils/helpers");

async function getItems(req, res, next) {
  try {
    const clothingItems = await ClothingItem.find({});

    sendSuccessResponse(res, clothingItems);
  } catch (err) {
    next(err);
  }
}

async function createItem(req, res, next) {
  const { name, weather, imageUrl } = req.body;

  try {
    const clothingItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    sendSuccessResponse(res, clothingItem, 201);
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  const { itemId } = req.params;

  try {
    const clothingItem = await ClothingItem.findById(itemId).orFail();

    if (clothingItem.owner.toString() !== req.user._id) {
      const err = new Error();
      err.name = "ForbiddenError";
      throw err;
    }

    await clothingItem.deleteOne();
    sendSuccessResponse(res, clothingItem);
  } catch (err) {
    next(err);
  }
}

async function toggleLike(req, res, next) {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  const operation = req.method === "DELETE" ? "$pull" : "$addToSet";

  try {
    const like = await ClothingItem.findByIdAndUpdate(
      itemId,
      { [operation]: { likes: userId } },
      { new: true }
    ).orFail();

    sendSuccessResponse(res, like);
  } catch (err) {
    next(err);
  }
}

module.exports = { getItems, createItem, deleteItem, toggleLike };
