function sendSuccessResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json(data);
}

module.exports = {
  sendSuccessResponse,
};
