const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("./errors");

function getStatusCode(err) {
  if (err.name === "CastError" || err.name === "ValidationError") {
    return BAD_REQUEST;
  }
  if (err.name === "AuthenticationError") {
    return UNAUTHORIZED;
  }
  if (err.name === "DocumentNotFoundError") {
    return NOT_FOUND;
  }
  if (err.code === 11000) {
    return CONFLICT;
  }
  return INTERNAL_SERVER_ERROR;
}

function sendErrorResponse(res, err) {
  const statusCode = getStatusCode(err);

  if (statusCode === UNAUTHORIZED) {
    return res
      .status(statusCode)
      .json({ message: "Incorrect email or password" });
  }
  if (statusCode === INTERNAL_SERVER_ERROR) {
    return res
      .status(statusCode)
      .json({ message: "An error has occurred on the server." });
  }
  if (statusCode === CONFLICT) {
    return res
      .status(statusCode)
      .json({ message: "An account with this email already exists." });
  }
  return res.status(statusCode).json({ message: err.message });
}

function sendSuccessResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({ data });
}

module.exports = { sendErrorResponse, sendSuccessResponse };
