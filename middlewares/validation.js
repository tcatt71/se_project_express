const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

function validateURL(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
}

// The clothing item body when an item is created
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": "A condition in the 'weather' field must be selected",
    }),
  }),
});

// The user info body when a user is created
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
      "string.email": "The 'email' field must be a valid email",
    }),
    password: Joi.string().required().min(6).messages({
      "password.empty": "The 'password' field must be filled in",
      "password.min": "The minimum length of the 'password' field is 6",
    }),
  }),
});

// Authentication when a user logs in
const validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
      "string.email": "The 'email' field must be a valid email",
    }),
    password: Joi.string().required().min(6).messages({
      "password.empty": "The 'password' field must be filled in",
      "password.min": "The minimum length of the 'password' field is 6",
    }),
  }),
});

// The user info body when a profile is updated
const validateUpdateProfileBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
    }),
    avatar: Joi.string().custom(validateURL).messages({
      "string.uri": "The 'image' field must be a valid url",
    }),
  }),
});

// User and clothing item IDs when they are accessed
const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateCardBody,
  validateUserBody,
  validateLoginBody,
  validateUpdateProfileBody,
  validateId,
};
