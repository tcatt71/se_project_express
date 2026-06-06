const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { createAuthError } = require("../utils/helpers");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Wrong email format",
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password
) {
  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    throw createAuthError();
  }
  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw createAuthError();
  }
  return user;
};

module.exports = mongoose.model("user", userSchema);
