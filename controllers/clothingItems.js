const ClothingItem = require("../models/clothingItem");
const { sendSuccessResponse } = require("../utils/helpers");

const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

async function getItems(req, res, next) {
  try {
    const clothingItems = await ClothingItem.find({});

    return sendSuccessResponse(res, clothingItems);
  } catch (err) {
    return next(err);
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

    return sendSuccessResponse(res, clothingItem, 201);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError("Invalid data provided for item creation")
      );
    }
    return next(err);
  }
}

async function deleteItem(req, res, next) {
  const { itemId } = req.params;

  try {
    const clothingItem = await ClothingItem.findById(itemId).orFail();

    if (clothingItem.owner.toString() !== req.user._id) {
      return next(
        new ForbiddenError("You are not allowed to delete this item")
      );
    }

    await clothingItem.deleteOne();
    return sendSuccessResponse(res, clothingItem);
  } catch (err) {
    if (err.name === "DocumentNotFoundError" || err.name === "CastError") {
      return next(new NotFoundError("Item not found"));
    }
    return next(err);
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

    return sendSuccessResponse(res, like);
  } catch (err) {
    if (err.name === "DocumentNotFoundError" || err.name === "CastError") {
      return next(new NotFoundError("Item not found"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data provided"));
    }
    return next(err);
  }
}

module.exports = { getItems, createItem, deleteItem, toggleLike };
