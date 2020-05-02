const RestfulError = require('./RestfulError')

class InternalError extends RestfulError {
  constructor(message) {
    super(message, RestfulError.InternalErrorCode, 500)
  }
}

module.exports = InternalError