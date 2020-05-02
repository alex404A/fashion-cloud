const RestfulError = require('./RestfulError')

class ParameterIllegalError extends RestfulError {
  constructor(message) {
    super(message, RestfulError.ParameterIllegalErrorCode, 400)
  }
}

module.exports = ParameterIllegalError