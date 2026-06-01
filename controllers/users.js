const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/helpers");
const { JWT_SECRET } = require("../utils/config");

async function getUsers(req, res) {
  try {
    const users = await User.find({});
    return sendSuccessResponse(res, users);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

async function getCurrentUser(req, res) {
  const { _id: userId } = req.user;

  try {
    const user = await User.findById(userId).orFail();
    return sendSuccessResponse(res, user);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
}

function createUser(req, res) {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;

      sendSuccessResponse(res, userObj, 201);
    })
    .catch((err) => sendErrorResponse(res, err));
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.name = "ValidationError";

    return sendErrorResponse(res, err);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return sendSuccessResponse(res, { token });
    })
    .catch((err) => sendErrorResponse(res, err));
}

function updateProfile(req, res) {
  const { _id: userId } = req.user;
  const { name, avatar } = req.body;

  const update = { name, avatar };
  const options = { runValidators: true, new: true };

  User.findByIdAndUpdate(userId, update, options)
    .orFail()
    .then((user) => sendSuccessResponse(res, user))
    .catch((err) => sendErrorResponse(res, err));
}

module.exports = { getUsers, getCurrentUser, createUser, login, updateProfile };
