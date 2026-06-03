const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("./errors");

function sendErrorResponse(res, err) {
  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).json({ message: "Invalid input provided" });
  }
  if (err.name === "ValidationError") {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Missing or invalid data provided" });
  }
  if (err.name === "AuthenticationError") {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Incorrect email or password" });
  }
  if (err.name === "ForbiddenError") {
    return res
      .status(FORBIDDEN)
      .json({ message: "You are not allowed to perform this operation" });
  }
  if (err.name === "DocumentNotFoundError") {
    return res
      .status(NOT_FOUND)
      .json({ message: "Requested resource not found" });
  }
  if (err.code === 11000) {
    return res
      .status(CONFLICT)
      .json({ message: "An account with this email already exists." });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .json({ message: "An error has occurred on the server." });
}

function sendSuccessResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({ data });
}

module.exports = { sendErrorResponse, sendSuccessResponse };
