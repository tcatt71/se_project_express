const jwt = require("jsonwebtoken");
const { createAuthError } = require("../utils/helpers");

const { JWT_SECRET } = require("../utils/config");

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const err = createAuthError();
    next(err);
    return;
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new Error();
    error.name = "UnauthorizedError";

    next(error);
    return;
  }

  req.user = payload;
  next();
}

module.exports = { authMiddleware };
