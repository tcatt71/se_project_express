const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { sendSuccessResponse } = require("../utils/helpers");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

async function getCurrentUser(req, res, next) {
  const { _id: userId } = req.user;

  try {
    const user = await User.findById(userId).orFail();
    return sendSuccessResponse(res, user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError" || err.name === "CastError") {
      return next(new NotFoundError("No user with matching ID found"));
    }
    return next(err);
  }
}

async function createUser(req, res, next) {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Missing or invalid data provided"));
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });

    const userObj = user.toObject();
    delete userObj.password;

    return sendSuccessResponse(res, userObj, 201);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Missing or invalid data provided"));
    }
    if (err.code === 11000) {
      return next(
        new ConflictError("An account with this email already exists")
      );
    }
    return next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Missing or invalid data provided"));
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return sendSuccessResponse(res, { token });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    return next(err);
  }
}

async function updateProfile(req, res, next) {
  const { _id: userId } = req.user;
  const { name, avatar } = req.body;

  const update = {};

  if (name !== undefined) {
    update.name = name;
  }

  if (avatar !== undefined) {
    update.avatar = avatar;
  }

  const options = { runValidators: true, new: true };

  try {
    const user = await User.findByIdAndUpdate(userId, update, options).orFail();

    return sendSuccessResponse(res, user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }
    if (err.name === "ValidationError" || err.name === "CastError") {
      return next(new BadRequestError("Invalid data provided"));
    }
    return next(err);
  }
}

module.exports = { getCurrentUser, createUser, login, updateProfile };
