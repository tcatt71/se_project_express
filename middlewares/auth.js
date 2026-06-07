const jwt = require("jsonwebtoken");
const { sendErrorResponse, createAuthError } = require("../utils/helpers");

const { JWT_SECRET } = require("../utils/config");

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const err = createAuthError();
    return sendErrorResponse(res, err);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = createAuthError();
    return sendErrorResponse(res, error);
  }

  req.user = payload;
  return next();
}

module.exports = { authMiddleware };
