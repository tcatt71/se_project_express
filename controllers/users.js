const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/helpers");

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
    .then((user) => sendSuccessResponse(res, user))
    .catch((err) => sendErrorResponse(res, err));
}

module.exports = { getUsers, getUser, createUser };
