class RestfulError extends Error {
  constructor(message, errorCode, statusCode) {
    super(message)
    this.message = message
    this.errorCode = errorCode
    this.statusCode = statusCode
  }
}

RestfulError.ParameterIllegalErrorCode = 1
RestfulError.InternalErrorCode = 2

module.exports = RestfulError