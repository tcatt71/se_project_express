const jwt = require("jsonwebtoken");
const { sendErrorResponse, createAuthError } = require("../utils/helpers");

const { JWT_SECRET } = require("../utils/config");

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw createAuthError();
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
