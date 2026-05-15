const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("./errors");

function getStatusCode(err) {
  if (err.name === "DocumentNotFoundError") {
    return NOT_FOUND;
  }
  if (err.name === "CastError") {
    return BAD_REQUEST;
  }
  if (err.name === "ValidationError") {
    return BAD_REQUEST;
  }
  return INTERNAL_SERVER_ERROR;
}

function sendErrorResponse(res, err) {
  const statusCode = getStatusCode(err);

  if (statusCode === INTERNAL_SERVER_ERROR) {
    return res
      .status(statusCode)
      .json({ message: "An error has occurred on the server." });
  }
  return res.status(statusCode).json({ message: err.message });
}

function sendSuccessResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({ data });
}

module.exports = { sendErrorResponse, sendSuccessResponse };
