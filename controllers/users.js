const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/helpers");
const { JWT_SECRET } = require("../utils/config");

async function getCurrentUser(req, res) {
  const { _id: userId } = req.user;

  try {
    const user = await User.findById(userId).orFail();
    return sendSuccessResponse(res, user);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

async function createUser(req, res) {
  const { name, avatar, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });

    const userObj = user.toObject();
    delete userObj.password;

    return sendSuccessResponse(res, userObj, 201);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error();
    err.name = "ValidationError";
    return sendErrorResponse(res, err);
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return sendSuccessResponse(res, { token });
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

async function updateProfile(req, res) {
  const { _id: userId } = req.user;
  const { name, avatar } = req.body;

  const update = { name, avatar };
  const options = { runValidators: true, new: true };

  try {
    const user = await User.findByIdAndUpdate(userId, update, options).orFail();

    return sendSuccessResponse(res, user);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

module.exports = { getCurrentUser, createUser, login, updateProfile };
