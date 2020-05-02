const logger = require('./logger')

class MongoConfig {
  constructor() {
    this.username = 'next'
    this.password = 'common!dev'
    this.host = '128.106.66.190'
    this.port = '57017'
    this.db = 'trial'
    this.authdb = 'admin'
  }
}

let APPLICATION_NODE_PORT = '8999'
const mongoConfig = new MongoConfig()

if (process.env.APPLICATION_NODE_PORT) {
  APPLICATION_NODE_PORT = process.env.APPLICATION_NODE_PORT
}

if (!process.env.MONGODB_USERNAME) {
  logger.error(`no mongodb username configured`)
  process.exit(1)
} else {
  mongoConfig.username = process.env.MONGODB_USERNAME
}

if (!process.env.MONGODB_PASSWORD) {
  logger.error(`no mongodb password configured`)
  process.exit(1)
} else {
  mongoConfig.password = process.env.MONGODB_PASSWORD
}

if (process.env.MONGODB_HOST) {
  mongoConfig.host = process.env.MONGODB_HOST
}

if (process.env.MONGODB_PORT) {
  mongoConfig.port = process.env.MONGODB_PORT
}

if (process.env.MONGODB_DB) {
  mongoConfig.db = process.env.MONGODB_DB
}

if (process.env.MONGODB_AUTHDB) {
  mongoConfig.authdb = process.env.MONGODB_AUTHDB
}

module.exports = {
  APPLICATION_NODE_PORT,
  mongoConfig
}