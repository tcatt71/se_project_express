const ClothingItem = require("../models/clothingItem");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/helpers");

async function getItems(req, res) {
  try {
    const clothingItems = await ClothingItem.find({});

    return sendSuccessResponse(res, clothingItems);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

async function createItem(req, res) {
  const { name, weather, imageUrl } = req.body;

  try {
    const clothingItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    return sendSuccessResponse(res, clothingItem, 201);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

async function deleteItem(req, res) {
  const { itemId } = req.params;

  try {
    const clothingItem = await ClothingItem.findById(itemId).orFail();

    if (clothingItem.owner.toString() !== req.user._id) {
      const err = new Error();
      err.name = "ForbiddenError";
      throw err;
    }

    await clothingItem.deleteOne();
    return sendSuccessResponse(res, clothingItem);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

async function toggleLike(req, res) {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  const operation = req.method === "DELETE" ? "$pull" : "$addToSet";

  try {
    const like = await ClothingItem.findByIdAndUpdate(
      itemId,
      { [operation]: { likes: userId } },
      { new: true }
    ).orFail();

    return sendSuccessResponse(res, like);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

module.exports = { getItems, createItem, deleteItem, toggleLike };
