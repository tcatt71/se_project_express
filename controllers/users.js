const User = require("../models/user");

function getUsers(req, res) {
  User.find({}).then((users) => res.send({ data: users }));
}

function getUser(req, res) {
  const { id } = req.params;
  User.findById(id).then((user) => res.send({ data: user }));
}

function createUser(req, res) {
  const { name, avatar } = req.body;
  User.create(name, avatar).then((user) => res.send({ data: user }));
}

module.exports = { getUsers, getUser, createUser };
