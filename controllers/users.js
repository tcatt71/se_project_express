const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/helpers");
const { JWT_SECRET } = require("../utils/config");

function getUsers(req, res) {
  User.find({})
    .then((users) => sendSuccessResponse(res, users))
    .catch((err) => sendErrorResponse(res, err));
}

function getUser(req, res) {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => sendSuccessResponse(res, user))
    .catch((err) => sendErrorResponse(res, err));
}

function createUser(req, res) {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      sendSuccessResponse(
        res,
        {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        },
        201
      )
    )
    .catch((err) => sendErrorResponse(res, err));
}

function login(req, res) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return sendSuccessResponse(res, token);
    })
    .catch((err) => sendErrorResponse(res, err));
}

module.exports = { getUsers, getUser, createUser, login };
