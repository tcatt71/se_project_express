const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../utils/helpers");

const { JWT_SECRET } = process.env;

function handleAuthError(res) {
  const error = new Error("Authorization Error");
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
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
}

module.exports = { authMiddleware };
