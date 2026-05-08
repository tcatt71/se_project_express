const User = require("../models/user");

function getUsers(req, res) {
  User.findAll({}).then((users) => res.send({ data: users }));
}

function getUser(req, res) {
  const { id } = req.params.id;
  User.findById(id).then((user) => res.send({ data: user }));
}

function createUser(req, res) {
  const { name, avatar } = req.body;
  User.create(name, avatar).then((user) => res.send({ data: user }));
}

module.exports = { getUsers, getUser, createUser };
