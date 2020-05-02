const logger = require('./logger')

let APPLICATION_NODE_PORT = '8999'
let ENV

if (process.env.APPLICATION_NODE_PORT) {
  APPLICATION_NODE_PORT = process.env.APPLICATION_NODE_PORT
}

if (process.env.APPLICATION_NODE_PORT) {
  logger.error(`no env configured`)
  process.exit(1)
} else {
  ENV = process.env.ENV
}

module.exports = {
  APPLICATION_NODE_PORT
}