const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../utils/helpers");

const { JWT_SECRET } = require("../utils/config");

function handleAuthError(res) {
  const error = new Error();
  error.name = "AuthenticationError";

  return sendErrorResponse(res, error);
}

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return sendErrorResponse(res, err);
  }

  req.user = payload;
  return next();
}

module.exports = { authMiddleware };
