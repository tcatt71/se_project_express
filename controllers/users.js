const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { sendSuccessResponse } = require("../utils/helpers");
const { JWT_SECRET } = require("../utils/config");

async function getCurrentUser(req, res, next) {
  const { _id: userId } = req.user;

  try {
    const user = await User.findById(userId).orFail();
    return sendSuccessResponse(res, user);
  } catch (err) {
    return next(err);
  }
}

async function createUser(req, res, next) {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    const err = new Error();
    err.name = "ValidationError";
    next(err);
    return;
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });

    const userObj = user.toObject();
    delete userObj.password;

    sendSuccessResponse(res, userObj, 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error();
    err.name = "ValidationError";
    next(err);
    return;
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    sendSuccessResponse(res, { token });
  } catch (err) {
    next(err);
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

    sendSuccessResponse(res, user);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCurrentUser, createUser, login, updateProfile };
