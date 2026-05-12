const User = require("../models/user");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).json({ message: err.message });
    });
}

function getUser(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ message: err.message });
    });
}

function createUser(req, res) {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ message: err.message });
    });
}

module.exports = { getUsers, getUser, createUser };
