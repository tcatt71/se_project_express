function sendSuccessResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json(data);
}

function createAuthError() {
  const error = new Error();
  error.name = "AuthenticationError";
  return error;
}

module.exports = {
  sendSuccessResponse,
  createAuthError,
};
